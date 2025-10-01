const [open, setOpen] = useState(true);
  // dashboard different menus
  const MenuOptions = [
    {
      menu_icon: LayoutDashboard,
      name: 'Dashboard',
      Link_path: '/dashboard'
    },
    {
      menu_icon: Building,
      name: 'Properties',
      Link_path: '/dashboard/properties'
    },
    {
      menu_icon: UserCircle,
      name: 'Profile',
      Link_path: '/dashboard/profile'
    },
    {
      menu_icon: HistoryIcon,
      name: 'Transactions',
      Link_path: '/dashboard/transactions'
    },
    {
      menu_icon: Bell,
      name: 'Notifications',
      Link_path: '/dashboard/notification'
    },
    {
      menu_icon: Coins,
      name: 'Subscription plans',
      Link_path: '/dashboard/subscription-plan'
    },
  ]