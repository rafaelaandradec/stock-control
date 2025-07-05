import { ProductsService } from 'src/app/services/products/products.service';
import { CreateProductRequest } from '../../../../models/interfaces/products/request/CreateProductRequest';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/responses/GetCategoriesResponse';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';
import { ProductEvent } from 'src/app/models/enums/products/ProductEvent';
import { EditProductRequest } from 'src/app/models/interfaces/products/request/EditProductRequest';

@Component({
  selector: 'app-products-form',
  templateUrl: './products-form.component.html',
  styleUrls: []
})
export class ProductsFormComponent implements OnInit, OnDestroy{
  private readonly destroy$: Subject<void> = new Subject();

  public categoriesDatas: Array<GetCategoriesResponse> = [];
  public selectedCategory: Array<{name:string, code:string}> = [];

  public productAction!: {
    event: EventAction;
    productsDatas: Array<GetAllProductsResponse>;
  };
  public productSelectedDatas!: GetAllProductsResponse;
  public productsDatas: Array<GetAllProductsResponse> = [];

  //formulário de add
  public addProductForm = this.formBuilder.group({
    name: ['', Validators. required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    category_id: ['', Validators.required],
    amount: [0, Validators.required],
  });

  //formulário de editar
  public editProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    amount: [0, Validators.required],
    category_id: ['', Validators.required],
  });

  public renderDropdown = false;

  public addProductAction = ProductEvent.ADD_PRODUCT_EVENT;
  public editProductAction = ProductEvent.EDIT_PRODUCT_EVENT;
  public saleProductAction = ProductEvent.SALE_PRODUCT_EVENT;

  constructor(
    private categoriesService: CategoriesService,
    private productsService: ProductsService,
    private productsDtService: ProductsDataTransferService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    public ref: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.productAction = this.ref.data;
      console.log('productAction:', this.productAction);

    this.productAction?.event?.action === this.saleProductAction && this.getProductsDatas();

    this.getAllCategories();
    this.renderDropdown = true;
  }

  getAllCategories(){
    this.categoriesService.getAllCategories()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        if (response.length > 0){
          this.categoriesDatas =response;

    if(this.productAction?.event?.action === this.editProductAction &&
      this.productAction?.productsDatas
    ){
      this.getProductSelectedDatas(this.productAction?.event?.id as string);
    }
        }
      },
    });
  }

  //adicionar novo produto
  handleSubmitAddProduct(): void {
    if(this.addProductForm?.value && this.addProductForm?.valid) {
      const requestCreateProduct: CreateProductRequest = {
        name: this.addProductForm.value.name as string,
        price: this.addProductForm.value.price as string,
        description: this.addProductForm.value.description as string,
        category_id: this.addProductForm.value.category_id as string,
        amount: Number(this.addProductForm.value.amount)
      };

      this.productsService.createProduct(requestCreateProduct)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if(response) {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Produto criado com sucesso!',
              life: 2500,
            });
          }
        }, error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao criar produto, tente novamente.',
            life: 2500,
          });
        },
      });
    }

    this.addProductForm.reset();
  }

  //editar produto
  handleSubmitEditProduct(): void {
    if(this.editProductForm.value &&
      this.editProductForm.valid &&
      this.productAction.event.id
     ){
      const requestEditProduct: EditProductRequest = {
        name: this.editProductForm.value.name as string,
        price: this.editProductForm.value.price as string,
        description: this.editProductForm.value.description as string,
        product_id: this.productAction?.event?.id,
        amount: this.editProductForm.value.amount as number,
        category_id: this.editProductForm.value.category_id as string,
      };

      this.productsService.editProduct(requestEditProduct)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary:'Sucesso',
            detail: 'Produto editado com sucesso!',
            life: 2500,
          });
          this.editProductForm.reset();
        }, error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao editar produto, tente novamente!',
            life: 2500,
          });
          this.editProductForm.reset();
        }
      });
    }
  }

  getProductSelectedDatas(productId: string): void {
    const allProducts = this.productAction?.productsDatas;

    if(allProducts.length > 0){
      const productFiltered = allProducts.filter(
        (element) => element?.id === productId
      );

      if(productFiltered){
        this.productSelectedDatas = productFiltered[0];

        //aqui traz os campos pra edição preenchida no formulário
        this.editProductForm.setValue({
          name: this.productSelectedDatas?.name,
          price: this.productSelectedDatas?.price,
          amount: this.productSelectedDatas?.amount,
          description: this.productSelectedDatas?.description,
          category_id: this.productSelectedDatas?.category?.id,
        });
      }
    }
  }

  getProductsDatas(): void {
    this.productsService.getAllProducts()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        if(response.length > 0) {
          this.productsDatas = response;
          this.productsDatas && this.productsDtService.setProductsDatas(this.productsDatas);
        }
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
