import { INavLink } from '@models/interfaces/nav-link.interface';

export const navItems: INavLink[] = [
  {
    icon: 'no',
    title: '1 First menu item',
    permissions: ['profile_view'],
    path: '/first'
  },
  {
    icon: 'no',
    title: '2 Second menu item',
    permissions: ['profile_view'],
    path: '/second',
    children: [
      {
        title: '2.1 First child of second menu item',
        permissions: ['profile_view'],
        path: '/second/first'
      },
      {
        title: '2.2 Second child of second menu item',
        permissions: ['profile_view'],
        path: '/second/second'
      },
      {
        title: '2.3 Third child of second menu item',
        permissions: ['profile_view'],
        path: '/second/third'
      }
    ]
  }
];
