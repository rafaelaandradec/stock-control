import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { AuthRequest } from 'src/app/models/interfaces/user/auth/AuthRequest';
import { SignupUserRequest } from 'src/app/models/interfaces/user/SignupUserRequest';
import { UserService } from 'src/app/services/user/user.service';

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

constructor(
  private formBuilder: FormBuilder,
  private userService: UserService, //importando o serviço de usuário
  private cookieService: CookieService,
  private messageService: MessageService
) {}

onSubmitLoginForm(): void { //método chamado ao enviar o formulário de login
if(this.loginForm.value && this.loginForm.valid) { //aqui verifica se o form está preenchido e válido
  this.userService.authUser(this.loginForm.value as AuthRequest) //se estiver, chama o serviço de autenticação passando o valor do form como parâmetro
  .subscribe({
    next: (response) => {
      if(response) {
        this.cookieService.set('USER_INFO', response?.token);

        this.loginForm.reset();
        //toast
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Bem-vindo(a) de volta ${response?.name}!`,
          life: 3000 //mensagem de sucesso que aparece por 3 segundos em tela
        });
      }
    },
    error: (err) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao fazer login. Verifique suas credenciais e tente novamente.',
        life: 3000 //mensagem de erro que aparece por 3 segundos
      });
      console.log(err);
      },
    });
  }
}

onSubmitSignupForm(): void { //método chamado ao enviar o formulário do cadastro
  if(this.signupForm.value && this.signupForm.valid) {
    this.userService.signupUser(this.signupForm.value as SignupUserRequest)
    .subscribe({
      next: (response) => {
        if(response) {
          this.signupForm.reset(); //limpa o formulário após o cadastro
          this.loginCard = true; //volta para a tela de login

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Usuário criado com sucesso!',
          life: 3000 //mensagem de sucesso que aparece por 3 segundos
        });
      }
    },
    error: (err) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao criar usuário.',
        life: 3000 //mensagem de erro que aparece por 3 segundos
      });
      console.log(err);
      },
    });
  }
}
}

