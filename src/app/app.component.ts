import { Component, ElementRef, ViewChild } from '@angular/core';
import { AngularFirestore } from  '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'fb-auth';
  dataSource : any;
  editObj: any;
  name: any;
  personalInfo: any;
  @ViewChild('btnShow')
  btnShow!: ElementRef;

  @ViewChild('btnClose')
  btnClose!: ElementRef;

  openDialog(){
    this.btnShow.nativeElement.click();
  }

  closeDialog(){
    this.btnClose.nativeElement.click();
  }


  constructor(private store: AngularFirestore){}

  ngOnInit(){
    this.getAll();
  }

  getAll() {
    this.store.collection('userInfo').snapshotChanges().subscribe((res: any) => {
      this.dataSource = res.map((item: any) => {
        console.log(item)
        return   Object.assign({id : item.payload.doc.id}, item.payload.doc.data())
      }
      );
    })
  }

  add(){
    if(this.editObj){
      this.store.collection('userInfo').doc(this.editObj.id).update({name : this.name, personalInfo : this.personalInfo});
    } else {
      this.store.collection('userInfo').add({name : this.name, personalInfo : this.personalInfo});
    }
    this.closeDialog();
  }

  edit(id : string){
    this.store.collection('userInfo').doc(id).get().subscribe((response) => {
      this.editObj = Object.assign({id : response.id}, response.data());
      this.name = this.editObj.name;
      this.personalInfo = this.editObj.personalInfo;
      this.openDialog();
    })
  }


  delete(id : string){
    this.store.collection('list').doc(id).delete();
  }

  clearEdit(){
    this.editObj = null;
    this.name = "";
    this.personalInfo = "";
  }
}
