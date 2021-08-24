import { LightningElement, api } from 'lwc';

export default class GameTile extends LightningElement {
    @api game ={}//this is updating for the data, because the data strcuture is object. if this field is not object, then it will throw out the error

    handleClick(){
        this.dispatchEvent(new CustomEvent('selected',{
            detail:this.game.Id //return Game Id
        }))
    }
}