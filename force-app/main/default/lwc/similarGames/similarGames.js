import { LightningElement,api,wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import GAME_TAB_FIELD from '@salesforce/schema/Game__c.Game_Tab__c'
import getSimilarGames from '@salesforce/apex/GameController.getSimilarGames'

import {NavigationMixin} from 'lightning/navigation'
export default class SimilarGames extends NavigationMixin(LightningElement) {
    similarGames

    @api recordId;
    @api objectApiName;

    @wire(getRecord,{recordId: '$recordId', fields:[GAME_TAB_FIELD]})
    game

    //fetch the simliar game by the Apex class
    fetchSimilarGames(){
        getSimilarGames({
            gameId:this.recordId, //pass the Id to Apex as paramter
            gameTab:this.game.data.fields.Game_Tab__c.value // pass the game tab value to Apex as parameter
        }).then(result=>{
            this.similarGames = result //assign the value into similarGames
            console.log(this.similarGames)
        }).catch(error=>{
            console.error(error)
        })
    }

    //Access to the other game that similar to the current games
    handleViewDetailsClick(event){
        this[NavigationMixin.Navigate]({
            type:'standard__recordPage',
            attributes:{
                recordId:event.target.dataset.id,
                objectApiName: this.objectApiName,
                actionName:'view'
            }
        })
    }

    
}
