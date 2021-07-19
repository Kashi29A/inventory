import { Component, Input, OnInit, DoCheck, KeyValueDiffers, KeyValueDiffer, SimpleChanges } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { DataserviceService } from '../dataservice.service';
import { FHS } from '../models/fhs';
//import * as jsPDF from 'jspdf';
import jsPDF from 'jspdf'
// import jsPDF = require('jspdf') // // typescript without esModuleInterop flag
// import jsPDF from 'yworks-pdf' // using yworks fork
// import jsPDF from 'jspdf/dist/jspdf.node.debug' // for nodejs
import autoTable from 'jspdf-autotable';

declare const require: any;
@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styles: [`
        :host ::ng-deep .p-dialog .product-image {
            width: 150px;
            margin: 0 auto 2rem auto;
            display: block;
        }
    `],
  styleUrls: ['./datatable.component.scss']
})
export class DatatableComponent implements OnInit {
  productDialog: boolean;

  @Input() headerName = '';

  @Input() parentHeaderName = '';

  fhs: FHS[] = [];

  tabledata: FHS[] = [];

  record: FHS;

  selectedProducts: FHS[];

  submitted: boolean;

  statuses: any[];

  exportColumns: any[];

  EMR: any[];

  dept: any[];

  selectedEMR;

  selectedHospital;

  selectedDept;

  disabledHospital: boolean = true;

  disabledDept: boolean = true;

  differ: KeyValueDiffer<string, any>;

  disabledNew: boolean = true;

  hospitalList: any[] = [];

  deptList: any[] = [];
  viewDialog: boolean = false;
  cols: any[];
  globalFilter: string;
  constructor(private differs: KeyValueDiffers, private dataService: DataserviceService, private messageService: MessageService, private confirmationService: ConfirmationService) {
    //this.differ = this.differs.find({}).create();
    this.EMR = [
      { name: 'FHS', code: 'fhs' },
      { name: 'ACH', code: 'fhs' },
      { name: 'SLEH', code: 'fhs' }
    ]

    this.dept = [
      { name: 'ICU', code: 'icu' },
      { name: 'PACU', code: 'pacu' },
      { name: 'NICU', code: 'nicu' }
    ]

  }
  ngOnInit() {
    this.getData()
    this.cols = [
      { field: 'Hospital', header: 'Hospital' },
      { field: 'HospitalContacts', header: 'Hospital Contacts' },
      { field: 'Department', header: 'Department' },
      { field: 'State', header: 'State' },
      { field: 'Vendor', header: 'Vendor' },
      { field: 'VendorContacts', header: 'Vendor Contacts' },
      { field: 'Region', header: 'Region' },
      { field: 'Location', header: 'Location' },
      { field: 'DeviceType', header: 'Device Type' },
      { field: 'HospitalDeviceID', header: 'Hospital Device ID' },
      { field: 'EMRDeviceID', header: 'EMR Device ID' },
      { field: 'EMRInterface', header: 'EMR Interface' },
      { field: 'EMRIntConDetails', header: 'EMR Int Con Details' },
      { field: 'ServerTypeName', header: 'Server Type Name' },
      { field: 'ServerConDetails', header: 'Server Con Details' },
      { field: 'ServerContent', header: 'Server Content' },
      { field: 'SoftwareOSDetails', header: 'Software OS Details' },
      { field: 'CEBioMedContacts', header: 'CE Bio Med Contacts' },
      { field: 'CEBioMedManager', header: 'CE Bio Med Manager' },
      { field: 'SNOWGroup', header: 'SNOW Group' },
      { field: 'AdditionalDocURLs', header: 'Additional Doc URLs' }
    ];
    //this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }))

  }
  ngOnChanges(changes: SimpleChanges) {
    console.log(changes)
    //this.dataService.getData(changes.parentHeaderName.currentValue)
    this.dataService.getData("FHS").subscribe((data) => {
      console.log(data)
      this.fhs = data
    })
  }

  getData() {
    this.removeFilters("Refresh")
  }

  openNew() {
    this.record = {};
    this.submitted = false;
    this.productDialog = true;
  }

  deleteSelectedProducts() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected records?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.tabledata = this.tabledata.filter(val => !this.selectedProducts.includes(val));
        this.selectedProducts.forEach((val) => {
          this.dataService.deleteRecord(val).subscribe((data) => {
            console.log(data)
          })
        })
        this.selectedProducts = null;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Record Deleted', life: 3000 });
      }
    });
  }

  editRecord(fhs: FHS) {
    this.record = { ...fhs };
    this.productDialog = true;
  }

  viewRecord(fhs: FHS) {
    this.record = { ...fhs };
    this.viewDialog = true;
  }

  deleteRecord(record: FHS) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + record.Hospital + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dataService.deleteRecord(record).subscribe((data) => {
          console.log(data)
        })
        this.tabledata = this.tabledata.filter(val => val.IDX !== record.IDX);
        this.record = {};
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Record Deleted', life: 3000 });
      }
    });
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
    this.viewDialog = false;
  }

  saveProduct() {
    this.submitted = true;
    if (this.record.Hospital.trim()) {
      if (this.record.IDX) {
        this.tabledata[this.findIndexById(this.record.IDX)] = this.record;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Record Updated', life: 3000 });
          this.dataService.updateRecord(this.record, this.selectedEMR, this.selectedHospital, this.selectedDept).subscribe((data) => {
            console.log(data)
            this.tabledata = data;
            this.selectedDept = null;
            this.selectedHospital = null;
            this.selectedEMR = null;
            this.disabledDept = true;
            this.disabledHospital = true;
            this.globalFilter = null;
            this.removeFilters("refresh")
          })
      }
      else {
        console.log(this.record)
        this.dataService.createRecord(this.record).subscribe((data) => {
          console.log(data)
          if (data.originalError?.info?.event === "errorMessage") {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: data.originalError.info.message, life: 3000 });
          }
          else {
            this.removeFilters("refresh")
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'New Record Created', life: 3000 });
          }
        })
      }
      // this.tabledata = [...this.tabledata];
      this.productDialog = false;
      //this.tabledata.push(this.record);
      this.record = {};
    }
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.fhs.length; i++) {
      if (this.tabledata[i].IDX === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  createId(): string {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }
  exportPdf() {
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(this.exportColumns, this.tabledata);
        doc.save('products.pdf');
      })
    })
  }

  handleChangeEMR(e) {
    this.selectedHospital = null;
    this.selectedDept = null;
    this.disabledNew = true
    this.tabledata = []
    if (e.value && e.value.name) {
      this.dataService.getData(e.value.name).subscribe((data) => {
        console.log(data)
        this.fhs = data
        this.tabledata = data
        if (this.fhs.length > 0) {
          this.disabledHospital = false;
          let result = this.fhs.map(({ Hospital }) => Hospital)
          this.hospitalList = [...new Set(result)]
        }
      })

    }
    if (!this.selectedHospital) {
      this.disabledDept = true
    }
  }

  handleChangeHospital(e) {
    this.selectedDept = null;
    if (this.selectedHospital) {
      //this.tabledata = []
      this.dataService.getDataHospital(this.selectedEMR.name, this.selectedHospital)
        .subscribe(data => {
          console.log(data)
          this.tabledata = data
          if (this.fhs.length > 0) {
            let result = this.fhs.map(({ Department }) => Department)
            this.deptList = [...new Set(result)]
          }
        })
      this.disabledDept = false
    }
  }

  handleChangeDept(e) {
    if (this.selectedHospital) {
      this.disabledDept = false
      this.disabledNew = false;
      this.dataService.getDataDept(this.selectedEMR.name, this.selectedHospital, this.selectedDept)
        .subscribe(data => {
          console.log(data)
          this.tabledata = data
        })
    }
  }

  removeFilters(e) {
    this.dataService.getAllData().subscribe((data) => {
      this.tabledata = data;
      this.selectedDept = null;
      this.selectedHospital = null;
      this.selectedEMR = null;
      this.disabledDept = true;
      this.disabledHospital = true;
    })
  }

}
