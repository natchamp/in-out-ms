import { Component, OnInit } from '@angular/core';
import { CategoryExitMaterials, CategoryMaterials, ExitMaterial, Material} from '../models/models';
import { ApiService } from '../services/api.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'material-exit-list',
  templateUrl: './material-exit-list.component.html',
  styleUrls: ['./material-exit-list.component.scss']
})
export class MaterialExitListComponent {

  
  
  availableMaterials: ExitMaterial[] = [];
  materialsToDisplay: CategoryExitMaterials[] = [];
  displayedColumns: string[] = [
    'id',
    'pickupPersonPhoto',
    'pickupPersonName',
    'vehicleNumber',
    'mobileNumber',
    'materialDescription',
    'materialDocument',
    "date",
    'outtime',
    'delete',
    'print'
  ];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getAllMaterialExitLatest().subscribe({
      next: (res: ExitMaterial[]) => {
        this.availableMaterials = [];
        console.log(res);
        for (var material of res) this.availableMaterials.push(material);
        //this.updateList();

        this.addcategory();
        this.filterMaterials();

        //this.sortVisitors();
        console.log(this.availableMaterials)
      },
      error: (err: any) => console.log(err),
    });
  }

addcategory(){
  //for( let visitor of this.availableVisitors){}
  
  this.availableMaterials.forEach(element => {
    element.category='Material';
    if(element.outTime.trim().length==0){
      element.subCategory="IN Progress";
      element.isOut=false;
    }
    else{
      element.subCategory="Delivered";
      element.isOut=true;
  }
  });

  console.log(this.availableMaterials);
}

filterMaterials(){
  this.materialsToDisplay = [];
    for (let material of this.availableMaterials) {
      let exist = false;
      for (let categoryMaterials of this.materialsToDisplay) {
        if (
          material.category === categoryMaterials.category &&
          material.subCategory === categoryMaterials.subCategory
        )
          exist = true;
      }

      if (exist) {
        for (let categoryMaterials of this.materialsToDisplay) {
          if (
            material.category === categoryMaterials.category &&
            material.subCategory === categoryMaterials.subCategory
          )
          categoryMaterials.materials.push(material);
        }
      } else {
        this.materialsToDisplay.push({
          category: material.category,
          subCategory: material.subCategory,
          materials: [material],
        });
      }
    }
}


  getMaterialCount() {
    return this.materialsToDisplay.reduce((pv, cv) => cv.materials.length + pv, 0);
  }


  search(value: string) {
    value = value.toLowerCase();
    this.filterMaterials();
    if (value.length > 0) {
      this.materialsToDisplay = this.materialsToDisplay.filter((categoryMaterials) => {
        categoryMaterials.materials = categoryMaterials.materials.filter(
          (material) =>
          material.pickupPersonName.toLowerCase().includes(value) ||
          material.materialDescription.toLowerCase().includes(value)
        );
        return categoryMaterials.materials.length > 0;
      });
    }
  }

  outMaterial(material: Material) {
    const now = new Date();
    material.outTime=now.toLocaleTimeString();
    //let userid = this.api.getTokenUserInfo()?.id ?? 0;
    this.api.outMaterial(material).subscribe({
      next: (res: any) => {
        if (res === 'Material Delivered Successfully...') {
          material.isOut = true;
        }
        //alert('Material Delivered Successfully...');
        alert(res.toString());
      },
      error: (err: any) => console.log(err),
    });

    this.filterMaterials();
    location.reload()
  }

  deleteExitMaterial(material:ExitMaterial){

    const response = confirm("Are you Sure you want to delete Material Record - Name : "+material.pickupPersonName);

    if(response){
    console.log("Deleting Material = "+material.pickupPersonName);
    this.api.deleteExitMaterial(material).subscribe({
      next: data => {
          
      },
  });
    alert("Material Record Deleted Successfully...");
    this.filterMaterials();
    location.reload()
  }
  }


  isBlocked() {
    let blocked = this.api.getTokenUserInfo()?.blocked ?? true;
    return blocked;
  }

  isAccessBlocked() {
    //let blocked = this.api.getTokenUserInfo()?.blocked ?? true;
    return false;
  }

  generateA6PDF(materialInfoObj:ExitMaterial){
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [105, 148], // A6 dimensions in millimeters (width x height)
    });
    
       // Add text to PDF
    const companyLogo = 'assets/images/logo.jpg';
    //pdf.addImage(companyLogo, 'JPEG', 10, 10, 80, 10); // Parameters: image, format, x, y, width, height
    pdf.setFontSize(18);
    
    pdf.text('Innovative Technomics Pvt. Ltd.', 8, 17);
    pdf.setFontSize(10);
    //pdf.setFont('bold');
    pdf.text('Material Exit Gatepass', 32, 25);
    pdf.text('No. - '+materialInfoObj.id, 45, 30);


    // Add an image to PDF
    const imageUrl = 'assets/images/employee.png';
    //pdf.addImage(imageUrl, 'JPEG', 55, 50, 100, 100); // Parameters: image, format, x, y, width, height
    pdf.addImage(materialInfoObj.photo, 'JPEG', 30, 35, 40, 40); // Parameters: image, format, x, y, width, height

    const items = [
      ['Pickup Person', materialInfoObj.pickupPersonName],
      ['Vehicle Number', materialInfoObj.vehicleNumber],
      ['Mobile', materialInfoObj.mobileNumber],
    ['Material Description', materialInfoObj.materialDescription],
    ['Date', materialInfoObj.date],
    ['Exit Time', materialInfoObj.outTime],
      // Add more items here
    ];

    pdf.setFontSize(8);
    autoTable(pdf, {
     columnStyles: { 0: { fontSize: 8 } }, 
     styles: {fontSize:8},
      margin: { top: 80 },
      body: items,

    })
    
    pdf.setFontSize(8)
    pdf.text('Officer Sign            Security Sign', 30, 135);
    pdf.setFontSize(5)
    pdf.text('**Note - This is an auto generated pass', 35, 140);
    //pdf.text('       *** Do not lose this pass ***',30,135)
    pdf.output('dataurlnewwindow');
    //pdf.autoPrint()
    //pdf.save('generated-pdf.pdf');
  
  }
}
