import { Component } from '@angular/core';
import { SideNavItem } from '../models/models';

@Component({
  selector: 'side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent {
  sideNavContent: SideNavItem[] = [
    {
      title: 'Home',
      link: '/home',
    },
    {
      title: 'Employee Entry',
      link: 'employee/entry',
    },
    {
      title: 'Employee List',
      link: 'employee/list',
    },
    {
      title: 'Visitor Entry',
      link: 'visitor/entry',
    },
    {
      title: 'Visitor List',
      link: 'visitor/list',
    },
    {
      title: 'Material Entry',
      link: 'material/entry',
    },
    {
      title: 'Material List',
      link: 'material/list',
    },
    {
      title: 'Material Exit',
      link: 'material/exit',
    },
    {
      title: 'Material Exit List',
      link: 'material/exitlist',
    },
    {
      title: 'Activity',
      link: 'admin/activity'
    }
  ];
}
