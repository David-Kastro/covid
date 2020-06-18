/*!

=========================================================
* Black Dashboard React v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Dashboard from "views/Dashboard.js";
import Icons from "views/Icons.js";
import Exams from "views/Exams";
// import UserProfile from "views/UserProfile.js";
import Users from "views/Users";
import Labs from "views/Labs";

export const routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-chart-pie-36",
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/labs",
    name: "Laboratórios",
    rtlName: "ملف تعريفي للمستخدم",
    icon: "tim-icons icon-bank",
    component: Labs,
    layout: "/admin"
  },
  {
    path: "/exames",
    name: "Exames",
    rtlName: "إخطارات",
    icon: "tim-icons icon-sound-wave",
    component: Exams,
    layout: "/admin"
  },
  {
    path: "/users",
    name: "Usuários",
    rtlName: "ملف تعريفي للمستخدم",
    icon: "tim-icons icon-single-02",
    component: Users,
    layout: "/admin"
  },
];

export const adminRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-chart-pie-36",
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/exames",
    name: "Exames",
    rtlName: "إخطارات",
    icon: "tim-icons icon-sound-wave",
    component: Exams,
    layout: "/admin"
  },
  {
    path: "/users",
    name: "Usuários",
    rtlName: "ملف تعريفي للمستخدم",
    icon: "tim-icons icon-single-02",
    component: Users,
    layout: "/admin"
  },
];

export const medicRoutes = [
  {
    path: "/exames",
    name: "Seus Exames",
    rtlName: "إخطارات",
    icon: "tim-icons icon-sound-wave",
    component: Exams,
    layout: "/admin"
  },
];
