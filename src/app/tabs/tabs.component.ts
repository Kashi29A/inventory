import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  parentHeader = "FHS"
  header = " ICU"

  handleChange(e) {
    if (e.index === 0) {
      this.header = " ICU"
    }
    if (e.index === 1) {
      this.header = " PACU"
    }
    if (e.index === 2) {
      this.header = " NICU"
    }
  }

  handleChangeParent(e) {
    if (e.index === 0) {
      this.parentHeader = "FHS"
    }
    if (e.index === 1) {
      this.parentHeader = "ACH"
    }
    if (e.index === 2) {
      this.parentHeader = "SLEH"
    }
  }

}
