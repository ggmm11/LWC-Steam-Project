import { LightningElement, wire } from 'lwc';
//Naviation
import {NavigationMixin} from 'lightning/navigation'
//Game__c Schema
import GAME_OBJECT from '@salesforce/schema/Game__c'
import Name_FIELD from '@salesforce/schema/Game__c.Name'
import PICTURE_URL_FIELD from '@salesforce/schema/Game__c.Picture_URL__c'
import GAME_TAB_FIELD from '@salesforce/schema/Game__c.Game_Tab__c'
import LANGUAGE_FIELD from '@salesforce/schema/Game__c.Language__c'
import PRICE_FIELD from '@salesforce/schema/Game__c.Price__c'
import DEVELOPER_FIELD from '@salesforce/schema/Game__c.Developer__c'
import DLC_FIELD from '@salesforce/schema/Game__c.Number_of_DLCs__c'
import EDITION_FIELD from '@salesforce/schema/Game__c.Game_Edition__c'
//getFieldValue function define and used to extract field values

import { getFieldValue } from 'lightning/uiRecordApi'

import {subscribe, MessageContext, unsubscribe} from 'lightning/messageService'
import GAME_SELECTED_MESSAGE from '@salesforce/messageChannel/GameSelected__c'
export default class GameCard extends NavigationMixin(LightningElement)  {
    
    @wire(MessageContext)
    messageContext
    
    gameTabField = GAME_TAB_FIELD
    languageField = LANGUAGE_FIELD
    priceField = PRICE_FIELD
    developerField = DEVELOPER_FIELD
    dlcField = DLC_FIELD
    editionField = EDITION_FIELD

    //Id of Game__c object's record
    recordId

    //Games will display with specific format
    gameName
    gamePictureUrl

    //refer the game Subscription 
    gameSelectionSubscription
    hanldeRecordLoaded(event){
        const {records} = event.detail
        const recordData = records[this.recordId]
        this.gameName = getFieldValue(recordData, Name_FIELD)
        this.gamePictureUrl = getFieldValue(recordData, PICTURE_URL_FIELD)
    }

    connectedCallback(){
        this.subscribeHandler()
    }

    subscribeHandler(){
        this.gameSelectionSubscription = subscribe(this.messageContext, GAME_SELECTED_MESSAGE,(message)=>this.handleGameSelected(message))
    }

    handleGameSelected(message){
        this.recordId = message.gameId//get the gameId from the message service
    }


    disconnectedCallback(){
        unsubscribe(this.gameSelectionSubscription)
        this.gameSelectionSubscription = null
    }

    //Navigation record page
    handleNavigateToRecord(){
        this[NavigationMixin.Navigate]({
            type:'standard__recordPage',
            attributes:{
                recordId:this.recordId,
                objectApiName:GAME_OBJECT.objectApiName,
                actionName:'view'
            }
        })

    }
}