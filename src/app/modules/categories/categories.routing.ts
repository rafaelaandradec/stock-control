import { Component } from "@angular/core";
import { CategoriesHomeComponent } from "./page/categories-home/categories-home.component";
import { Routes } from "@angular/router";

export const CATEGORIES_ROUTES: Routes = [
  {
    path: '',
    component: CategoriesHomeComponent,
  }
]
