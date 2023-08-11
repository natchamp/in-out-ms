import { Component, OnInit } from '@angular/core';
import { CategoryMaterials, Material} from '../models/models';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'material-list',
  templateUrl: './material-list.component.html',
  styleUrls: ['./material-list.component.scss']
})
export class MaterialListComponent {

  
  availableMaterials: Material[] = [];
  materialsToDisplay: CategoryMaterials[] = [];
  displayedColumns: string[] = [
    'driverPhoto',
    'driverName',
    'vehicleNumber',
    'materialDescription',
    'materialDocument',
    "date",
    'intime',
    'outtime',
    'action'
  ];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getAllMaterials().subscribe({
      next: (res: Material[]) => {
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
          material.driverName.toLowerCase().includes(value) ||
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

  isBlocked() {
    let blocked = this.api.getTokenUserInfo()?.blocked ?? true;
    return blocked;
  }

  isAccessBlocked() {
    //let blocked = this.api.getTokenUserInfo()?.blocked ?? true;
    return false;
  }

}
