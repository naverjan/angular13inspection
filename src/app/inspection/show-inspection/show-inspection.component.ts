import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { InspectionApiService } from 'src/app/inspection-api.service';

@Component({
  selector: 'app-show-inspection',
  templateUrl: './show-inspection.component.html',
  styleUrls: ['./show-inspection.component.css']
})
export class ShowInspectionComponent implements OnInit {

  inspectionList$!:Observable<any[]>;
  inspectionTypesList$!:Observable<any[]>;
  inspectionTypesList:any=[];

  //Map to display data associate with foreign key
  inspectionTypesMap:Map<number, string> = new Map();

  constructor(private service:InspectionApiService) { }

  ngOnInit(): void {
    this.inspectionList$ = this.service.getInspectionList();
    this.inspectionTypesList$ = this.service.getInspectionsTypesList();
    this.refreshInspectionTypesMap();
  }

  modalTitle:string = '';
  activateAddEditInspectionComponent:boolean = false;
  inspection:any;

  modalAdd(){
    this.inspection = {
      id: 0,
      status: null,
      comments: null,
      inspectionTypeId: null
    }
    this.modalTitle = 'Add Inspection';
    this.activateAddEditInspectionComponent = true;
  }

  modalEdit(item:any){
    this.inspection = item;
    this.modalTitle ="Edit Inspection";
    this.activateAddEditInspectionComponent = true;
  }

  modalClose(){
    this.activateAddEditInspectionComponent = false;
    this.inspectionList$ = this.service.getInspectionList();
  }

  delete(item:any){
    if(confirm(`Are you sure you want to delete this inspection ${item.id}?`)){
      this.service.deleteInspection(item.id).subscribe(response =>{
        var closeModalBtn = document.getElementById('add-edit-modal-close');
      if(closeModalBtn){
        closeModalBtn.click();
      }

      var showDeleteSuccess = document.getElementById("delete-success-alert");
      if(showDeleteSuccess){
        showDeleteSuccess.style.display ="block";
      }
      //Hide alert success
      setTimeout(() => {
        if(showDeleteSuccess){
          showDeleteSuccess.style.display = "none";
        }
      }, 4000);
      })
    }
  }

  refreshInspectionTypesMap(){
    this.service.getInspectionsTypesList().subscribe(data => {
      this.inspectionTypesList = data;

      for (let index = 0; index < data.length; index++) {
        this.inspectionTypesMap.set(this.inspectionTypesList[index].id, this.inspectionTypesList[index].inspectionName);        
      }
    })
  }

}
