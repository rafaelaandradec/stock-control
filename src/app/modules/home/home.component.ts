import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
loginCard = true;

loginForm = this.formBuilder.group({
  email: ['', Validators.required],
  password: ['', Validators.required] //obrigatório preencher antes para validar
})

signupForm = this.formBuilder.group({
  name: ['', Validators.required],
  email: ['', [Validators.required]],
  password: ['', [Validators.required]],
})

constructor(private formBuilder: FormBuilder) {
}

onSubmitLoginForm(): void { //método chamado ao enviar o formulário
  console.log('DADOS DO FORMULÁRIO DO LOGIN', this.loginForm.value);
}

onSubmitSignupForm(): void { //método chamado ao enviar o formulário do cadastro
  console.log('DADOS DO FORMULÁRIO DO CADASTRO', this.signupForm.value);
}

}
