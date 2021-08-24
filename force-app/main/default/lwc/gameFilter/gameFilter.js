import { LightningElement,wire } from 'lwc';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
//Game object and field import
import GAME_OBJECT from '@salesforce/schema/Game__c'
import GAME_TAB_FIELD from '@salesforce/schema/Game__c.Game_Tab__c'
import LANGUAGE_FIELD from '@salesforce/schema/Game__c.Language__c'

//constants variable
const GAME_TAB_ERROR = 'Error loading Game Tab'
const LANGUAGE_ERROR = 'Error loading Language'

//Lightning Message Service and a message channel
import GAMES_FILTERED_MESSAGE from '@salesforce/messageChannel/GamesFiltered__c'
import { publish, MessageContext } from 'lightning/messageService';
export default class GameFilter extends LightningElement {
    filters={
        searchKey:'',
        maxPrice:100
    }
    gameTabError = GAME_TAB_ERROR
    languageError = LANGUAGE_ERROR
    timer
    //Load context for LMS
    @wire(MessageContext)
    messageContext

    //Fetching Game Tab Picklist
    @wire(getObjectInfo,{objectApiName:GAME_OBJECT})
    gameObjectInfo

    @wire(getPicklistValues,{
        recordTypeId:'$gameObjectInfo.data.defaultRecordTypeId',
        fieldApiName:GAME_TAB_FIELD})game_tabs
    
    
    //Fetching Game Tab Picklist
    @wire(getPicklistValues,{
        recordTypeId:'$gameObjectInfo.data.defaultRecordTypeId',
        fieldApiName:LANGUAGE_FIELD})languages


    //Search Key Handler
    handlerSearchKeyChange(event){
        console.log(event.target.value)//test if the handler is working
        this.filters = {...this.filters, "searchKey":event.target.value}//add the new key when user is typed in the filters object
        this.sendDataToGameList()
    }

    //Price Range Handler
    handlerMaxPriceChange(event){
        console.log(event.target.value)//test if the handler is working
        this.filters = {...this.filters, "maxPrice":event.target.value}
        this.sendDataToGameList()
    }

    handlerCheckbox(event){
        if(!this.filters.game_tabs){
            const game_tabs = this.game_tabs.data.values.map(item=>item.value)
            const languages = this.languages.data.values.map(item=>item.value)
            this.filters = {...this.filters, game_tabs, languages}
        }
        const {name, value} = event.target.dataset
        console.log("name", name)//test if the handler is working
        console.log("value", value)//test if the handler is working
        
        /*******************************Error Code*********************************************/
        if(event.target.checked){
            if(!this.filters[name].includes(value)){
                this.filters[name] = [...this.filters[name], value]
            }
        } else {
            this.filters[name] =  this.filters[name].filter(item=>item !==value)
        }
        /**************************************************************************************/
        this.sendDataToGameList()
    }
    

    sendDataToGameList(){
        window.clearTimeout(this.timer)
        this.timer = window.setTimeout(()=>{
            publish(this.messageContext,GAMES_FILTERED_MESSAGE,{
                filters:this.filters
            })
        },400)
        
    }
}