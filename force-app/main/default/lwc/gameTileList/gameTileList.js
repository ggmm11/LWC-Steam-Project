import { LightningElement,wire } from 'lwc';
import getGames from '@salesforce/apex/GameController.getGames'

//Lightning Message Service and a message channel
import GAMES_FILTERED_MESSAGE from '@salesforce/messageChannel/GamesFiltered__c'
import { publish, subscribe, MessageContext,unsubscribe } from 'lightning/messageService';
import GAME_SELECTED_MESSAGE from '@salesforce/messageChannel/GameSelected__c'
export default class GameTileList extends LightningElement {

    games=[]
    error
    filters={};
    gameFilterSubscription

    @wire(getGames,{filters:'$filters'})
    gamesHandler({data,error}){
        if(data){
            console.log(data)
            this.games = data //store all data into games property
        }
        if(error){
            this.error = error
            console.error(error)
        }
    }

    //Load context for LMS
    @wire(MessageContext)
    messageContext

    connectedCallback(){
        this.subscribeHandler()
    }

    subscribeHandler(){
        this.gameFilterSubscription = subscribe(this.messageContext,GAMES_FILTERED_MESSAGE, (message)=>this.handlerFilterChanges(message))
    }

    handlerFilterChanges(message){
        console.log(message.filters)
        this.filters ={...message.filters}
        
    }
    //Pass the game Id to gameCard Component
    handleGameSelected(event){
        console.log("selected game Id", event.detail)
        publish(this.messageContext,GAME_SELECTED_MESSAGE,{
            gameId:event.detail
        })
    }

    disconnectedCallback(){
        unsubscribe(this.gameFilterSubscription)
        this.gameFilterSubscription = null
    }
}