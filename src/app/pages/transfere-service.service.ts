import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TransfereServiceService {

  constructor() { }

  private fichindividuel;
  private detailsfranchise;
  private selectedfiche
  private TypeModif
  private detailsnotifs
  setData(fichindividuel){
    this.fichindividuel = fichindividuel;
  }

  getData(){
    let temp = this.fichindividuel;
    this.clearData();
    return temp;
  }
  clearData(){
    this.fichindividuel = undefined;
  }








  setDatafranchise(detailsfranchise){
    this.detailsfranchise = detailsfranchise;
  }

  getDatafranchise(){
    let temp = this.detailsfranchise;
    this.clearData();
    return temp;
  }
  clearDatafranchise(){
    this.detailsfranchise = undefined;
  }


  /******************notifications********** */

  setDatanotifs(detailsnotifs){
    this.detailsnotifs = detailsnotifs;
  }

  getDatanotifs(){
    let temp = this.detailsnotifs;
    this.clearData();
    return temp;
  }
  clearDatanotifs(){
    this.detailsnotifs = undefined;
  }


  /******************fin notifications********** */



  setDatafiche(selectedfiche){
    this.selectedfiche = selectedfiche;
  }



  clearDatafiche(){
    this.selectedfiche = undefined;
  }


  getDatapost(){
    let temp = this.selectedfiche;
    this.clearDatafiche();
    return temp;
  }

}
