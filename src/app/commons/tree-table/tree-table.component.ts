import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tree-table',
  templateUrl: './tree-table.component.html',
  styleUrls: ['./tree-table.component.scss']
})
export class TreeTableComponent implements OnInit {
  datos = [
    {
      data: {
        name: "Documents",
        size: "75kb",
        type: "Folder",
        open: false,
      },
      children: [
        {
          data: {
            name: 'Work',
            size: '55kb',
            type: 'Folder',
            open: false,
          },
          children: [
            {
              data: {
                name: 'Expenses.doc',
                size: '30kb',
                type: 'Document',
                open: false,
              }
            },
            {
              data: {
                name: 'Resume.doc',
                size: '25kb',
                type: 'Resume',
                open: false,
              }
            }
          ],
        },
        {
          data: {
            name: 'Home',
            size: '20kb',
            type: 'Folder',
            open: false,
          },
          children: [
            {
              data: {
                name: 'Invoices',
                size: '20kb',
                type: 'Text',
                open: false,
              }
            }
          ]
        }
      ]
    },
    {
      data: {
        name: 'Pictures',
        size: '150kb',
        type: 'Folder',
        open: false,
      },
      children: [
        {
          data: {
            name: 'barcelona.jpg',
            size: '90kb',
            type: 'Picture',
            open: false,
          }
        },
        {
          data: {
            name: 'primeui.png',
            size: '30kb',
            type: 'Picture',
            open: false,
          }
        },
        {
          data: {
            name: 'optimus.jpg',
            size: '30kb',
            type: 'Picture',
            open: false,
          }
        }
      ]
    }
  ];
  constructor() { }

  ngOnInit() {
  }
  // openTab(event) {
  //   if (!event.data.data.open && event.data.data.children != null && event.data.data.children.length > 0) {
  //     this.datos[event.index].data.open = true;
  //     this.datos = this.datos.slice(0, event.index + 1).concat(event.data.children).concat(this.datos.slice(event.index + 1));
  //   }
  //   else if (event.data.data.open && event.data.data.children != null && event.data.data.children.length > 0) {
  //     this.datos[event.index].data.open = false
  //     this.datos = this.datos.slice(0, event.index + 1).concat(event.data.children).concat(this.datos.slice(event.index + event.data.children.length + 1));
  //   }
  //   this.selectedDatos.pop();
  // }
}
