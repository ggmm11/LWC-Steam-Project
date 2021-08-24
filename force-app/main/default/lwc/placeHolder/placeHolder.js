import { LightningElement,api } from 'lwc';
//static resource
import GAME_PLACE_HOLDER from '@salesforce/resourceUrl/steam_logo'
export default class PlaceHolder extends LightningElement {
    @api message

    placeholderUrl = GAME_PLACE_HOLDER
}