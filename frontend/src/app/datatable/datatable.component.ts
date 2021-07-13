import { Component, Input, OnInit, DoCheck, KeyValueDiffers, KeyValueDiffer, SimpleChanges } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { DataserviceService } from '../dataservice.service';
import { FHS } from '../models/fhs';
import * as jsPDF from 'jspdf';
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
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log(changes)
    //this.dataService.getData(changes.parentHeaderName.currentValue)
    this.dataService.getData(changes.parentHeaderName.currentValue).subscribe((data) => {
      console.log(data)
      this.fhs = data
    })
  }
  // ngDoCheck() {
  //   const change = this.differ.diff(this);
  //   if (change) {
  //     change.forEachChangedItem(item => {
  //       console.log(item.currentValue);
  //     });
  //   }
  //   //this.getData()
  // }

  getData() {
    this.dataService.getData(this.parentHeaderName).subscribe((data) => {
      console.log(data)
      this.fhs = data
    })
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
        this.fhs = this.fhs.filter(val => !this.selectedProducts.includes(val));
        this.selectedProducts.forEach((val) => {
          this.dataService.deleteRecord(val).subscribe((data) => {
            console.log(data)
          })
        })
        this.selectedProducts = null;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
      }
    });
  }

  editRecord(fhs: FHS) {
    this.record = { ...fhs };
    this.productDialog = true;
  }

  deleteRecord(fhs: FHS) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + fhs.hospital_list + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log(fhs)
        this.dataService.deleteRecord(fhs).subscribe((data) => {
          console.log(data)
        })
        this.fhs = this.fhs.filter(val => val.FHS_id !== fhs.FHS_id);
        this.record = {};
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
      }
    });
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  saveProduct() {
    this.submitted = true;
    if (this.record.hospital_list.trim()) {
      if (this.record.FHS_id) {
        this.tabledata[this.findIndexById(this.record.FHS_id)] = this.record;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
      }
      else {
        this.record.FHS_id = this.tabledata[this.tabledata.length - 1].FHS_id + 1
        this.dataService.createRecord(this.record).subscribe((data) => {
          console.log(data)
        })
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
      }
      this.tabledata = [...this.tabledata];
      this.productDialog = false;
      this.tabledata.push(this.record);
      this.record = {};
    }
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.fhs.length; i++) {
      if (this.fhs[i].FHS_id === id) {
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
        doc.autoTable(this.exportColumns, this.fhs);
        doc.save('Records.pdf');
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
        if (this.fhs.length > 0) {
          this.disabledHospital = false;
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
      this.tabledata = []
      this.disabledDept = false
    }
  }

  handleChangeDept(e) {
    if (this.selectedHospital) {
      this.disabledDept = false
      this.disabledNew = false;
    }

    if (e.value && e.value.name) {
      this.dataService.getData(this.selectedEMR.name).subscribe((data) => {
        console.log(data)
        this.tabledata = data
      })
    }
  }

}
