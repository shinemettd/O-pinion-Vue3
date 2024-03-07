<template>
  <div class="wrapper fadeInDown">
    <div id="formContent">
      <router-link to="/auth"><h2 class="inactive underlineHover">Войти</h2></router-link>
      <h2 class="inactive text-black">Зарегистрироваться</h2>
      <div class="fadeIn first"></div>

      <form @submit.prevent="register">
        <div class="form-group">
          <input type="text" v-model="first_name" id="first_name" class="fadeIn second" name="first_name"
                 placeholder="Имя">
          <div v-if="errors.first_name" class="error-message">{{ errors.first_name }}</div>
        </div>

        <div class="form-group">
          <input type="text" v-model="last_name" id="last_name" class="fadeIn second" name="last_name"
                 placeholder="Фамилия">
          <div v-if="errors.last_name" class="error-message">{{ errors.last_name }}</div>
        </div>


        <div class="form-group">
          <input type="text" v-model="nickname" id="nickname" class="fadeIn second" name="nickname"
                 placeholder="Nickname">
          <div v-if="errors.nickname" class="error-message">{{ errors.nickname }}</div>
        </div>

        <div class="form-group">
          <input type="text" v-model="email" id="email" class="fadeIn second" name="email" placeholder="Email">
          <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
        </div>

        <div class="form-group date-group">
          <div class="center-input">
            <input type="date" v-model="birth_date" id="birth_date" class="fadeIn second small-label"
                   name="birth_date">
          </div>
          <div v-if="errors.birth_date" class="error-message">{{ errors.birth_date }}</div>
        </div>

        <div class="form-group password-wrapper">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            id="password"
            class="fadeIn third"
            name="пароль"
            placeholder="Пароль"
          />
          <button type="button" @click="togglePasswordVisibility" class="password-toggle">
            <i :class="showPassword ? 'fa fa-eye' : 'fa fa-eye-slash'"></i>
          </button>
          <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
        </div>

        <div class="form-group password-wrapper">
          <input
            :type="showConfirmPassword ? 'text' : 'password'"
            v-model="confirm_password"
            id="confirm_password"
            class="fadeIn third"
            name="confirm_password"
            placeholder="Подтвердите пароль"
          />
          <button type="button" @click="toggleConfirmPasswordVisibility" class="password-toggle">
            <i :class="showConfirmPassword ? 'fa fa-eye' : 'fa fa-eye-slash'"></i>
          </button>
          <div v-if="errors.confirm_password" class="error-message">{{ errors.confirm_password }}</div>
        </div>


        <input type="submit" class="fadeIn fourth" value="Зарегистрироваться">
      </form>


    </div>
  </div>
</template>

<script>
import {ref} from 'vue';
import axios from 'axios';
import store from "@/store/store";

export default {
  setup() {
    const first_name = ref('');
    const last_name = ref('');
    const nickname = ref('');
    const email = ref('');
    const password = ref('');
    const showConfirmPassword = ref(false);
    const birth_date = ref('');
    const confirm_password = ref('');

    const showPassword = ref(false);
    const errors = ref({});

    const register = async () => {
      errors.value = {};

      if (validateInputs()) {
        try {
          const response = await axios.post(`${store.state.API_URL}/api/auth/sign-up`, {
            first_name: first_name.value,
            last_name: last_name.value,
            nickname: nickname.value,
            email: email.value,
            password: password.value,
            birth_date: birth_date.value,
            confirm_password: confirm_password.value
          }, {
            headers: {
              'Content-Type': 'application/json',
            },
          });

          console.log(response.data);
          this.$router.push('/auth');

        } catch (error) {
        }
      }
    };

    const validateInputs = () => {
      let isValid = true;

      if (!first_name.value.trim()) {
        errors.value.first_name = 'Пожалуйста, введите имя.';
        isValid = false;
      }

      if (!last_name.value.trim()) {
        errors.value.last_name = 'Пожалуйста, введите фамилию.';
        isValid = false;
      }

      if (!nickname.value.trim()) {
        errors.value.nickname = 'Пожалуйста, введите username.';
        isValid = false;
      }

      if (!email.value.trim()) {
        errors.value.email = 'Пожалуйста, введите email.';
        isValid = false;
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
          errors.value.email = 'Пожалуйста, введите корректный email.';
          isValid = false;
        }
      }

      const currentDate = new Date();

      const birthDateInput = new Date(birth_date.value);

      if (!birth_date.value.trim()) {
        errors.value.birth_date = 'Пожалуйста, введите дату рождения.';
        isValid = false;
      } else {

        const age = currentDate.getFullYear() - birthDateInput.getFullYear();

        if (age < 10 || age > 120) {
          errors.value.birth_date = 'Возраст должен быть от 10 до 120 лет.';
          isValid = false;
        }
      }


      if (!password.value.trim()) {
        errors.value.password = 'Пожалуйста, введите пароль.';
        isValid = false;
      }


      if (password.value.length < 8 || password.value.length > 200) {
        errors.value.password = 'Пароль должен содержать от 8 до 200 символов.';
        isValid = false;
      }

      const uppercaseRegex = /[A-Z]/;
      const digitRegex = /\d/;
      const letterRegex = /[a-zA-Z]/;
      if (!letterRegex.test(password.value) || !uppercaseRegex.test(password.value) || !digitRegex.test(password.value)) {
        errors.value.password = 'Пароль должен содержать минимум 1 заглавную букву, 1 цифру и 1 букву.';
        isValid = false;
      }
      if (password.value !== confirm_password.value) {
        errors.value.confirm_password = 'Пароли не совпадают.';
        isValid = false;
      }

      return isValid;
    };

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };
    const toggleConfirmPasswordVisibility = () => {
      showConfirmPassword.value = !showConfirmPassword.value;
    };

    return {
      first_name,
      last_name,
      nickname,
      email,
      password,
      confirm_password,
      showPassword,
      register,
      showConfirmPassword,
      toggleConfirmPasswordVisibility,
      validateInputs,
      togglePasswordVisibility,
      birth_date,
      errors,
    };
  },
};
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css?family=Poppins');

input[type=text], input[type=password] {
  background-color: #f6f6f6;
  color: #0d0d0d;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 5px;
  width: 85%;
  border: 2px solid #f6f6f6;
  -webkit-transition: all 0.5s ease-in-out;
  -moz-transition: all 0.5s ease-in-out;
  -ms-transition: all 0.5s ease-in-out;
  -o-transition: all 0.5s ease-in-out;
  transition: all 0.5s ease-in-out;
  -webkit-border-radius: 5px 5px 5px 5px;
  border-radius: 5px 5px 5px 5px;
}

/* BASIC */

html {
  background-color: #56baed;
}

.small-label {
  font-size: 17px;
  color: #cccccc;
}

body {
  font-family: "Poppins", sans-serif;
  height: 100vh;
}

a {
  color: #92badd;
  display: inline-block;
  text-decoration: none;
  font-weight: 400;
}

h2 {
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  display: inline-block;
  margin: 40px 8px 10px 8px;
  color: #cccccc;
}

.date-group {
  background-color: #f6f6f6;
  border: none;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 5px;
  width: 85%;
  border: 2px solid #f6f6f6;
  transition: all 0.5s ease-in-out;
  border-radius: 5px;
}



.qwe {
  font-weight: bold;
  color: #1f42b2;
  font-size: 12px;
  margin-right: 2px;
}

input[type=submit].fadeIn.fourth {
  padding-left: 20px;
  padding-right: 20px;
  width: auto; /* Изменено на автоматическую ширину */
  max-width: 100%; /* Максимальная ширина 100% */
  margin: 20px 0; /* Добавлено небольшое отступание сверху и снизу */
}


.date-group input {
  width: 100%;
  background-color: transparent;
  border: none;
  outline: none;
}

.date-group input:focus {
  background-color: #fff;
  border-bottom: 2px solid #5fbae9;
}

.password-wrapper {
  position: relative;
}

.password-toggle {
  position: absolute;
  top: 50%;
  right: 50px;
  transform: translateY(-50%);
  border: none;
  background: none;
  cursor: pointer;
  font-size: 15px;
  font-bold: 17px;
  color: #15249f;
}


.wrapper {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  min-height: 100%;
  padding: 20px;
}

.date-group {
  text-align: center;
}

.center-input {
  display: inline-block;
}

#formFooter a {
  margin-bottom: 10px;
}


#formContent {
  -webkit-border-radius: 10px 10px 10px 10px;
  border-radius: 10px 10px 10px 10px;
  background: #fff;
  padding: 30px;
  width: 90%;
  max-width: 450px;
  position: relative;
  padding: 0px;
  -webkit-box-shadow: 0 30px 60px 0 rgba(0, 0, 0, 0.3);
  box-shadow: 0 30px 60px 0 rgba(0, 0, 0, 0.3);
  text-align: center;
  margin-top: -200px;
}

#formFooter {
  background-color: #f6f6f6;
  border-top: 1px solid #dce8f1;
  padding: 25px;
  text-align: center;
  -webkit-border-radius: 0 0 10px 10px;
  border-radius: 0 0 10px 10px;
}


/* TABS */

h2.inactive {
  color: #cccccc;
}

h2.active {
  color: #0d0d0d;

}


/* FORM TYPOGRAPHY*/

input[type=button], input[type=submit], input[type=reset] {
  background-color: #56baed;
  border: none;
  color: white;
  padding: 15px 80px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  text-transform: uppercase;
  font-size: 13px;
  -webkit-box-shadow: 0 10px 30px 0 rgba(95, 186, 233, 0.4);
  box-shadow: 0 10px 30px 0 rgba(95, 186, 233, 0.4);
  -webkit-border-radius: 5px 5px 5px 5px;
  border-radius: 5px 5px 5px 5px;
  margin: 5px 20px 40px 20px;
  -webkit-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}

input[type=button]:hover, input[type=submit]:hover, input[type=reset]:hover {
  background-color: #39ace7;
}

input[type=button]:active, input[type=submit]:active, input[type=reset]:active {
  -moz-transform: scale(0.95);
  -webkit-transform: scale(0.95);
  -o-transform: scale(0.95);
  -ms-transform: scale(0.95);
  transform: scale(0.95);
}

input[type=text] {
  background-color: #f6f6f6;
  border: none;
  color: #0d0d0d;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 5px;
  width: 85%;
  border: 2px solid #f6f6f6;
  -webkit-transition: all 0.5s ease-in-out;
  -moz-transition: all 0.5s ease-in-out;
  -ms-transition: all 0.5s ease-in-out;
  -o-transition: all 0.5s ease-in-out;
  transition: all 0.5s ease-in-out;
  -webkit-border-radius: 5px 5px 5px 5px;
  border-radius: 5px 5px 5px 5px;
}

input[type=text]:focus {
  background-color: #fff;
  border-bottom: 2px solid #5fbae9;
}

input[type=text]::placeholder {
  color: #cccccc;
}


/* ANIMATIONS */

/* Simple CSS3 Fade-in-down Animation */
.fadeInDown {
  -webkit-animation-name: fadeInDown;
  animation-name: fadeInDown;
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}

@-webkit-keyframes fadeInDown {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }
  100% {
    opacity: 1;
    -webkit-transform: none;
    transform: none;
  }
}

@keyframes fadeInDown {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }
  100% {
    opacity: 1;
    -webkit-transform: none;
    transform: none;
  }
}

/* Simple CSS3 Fade-in Animation */
@-webkit-keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@-moz-keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fadeIn {
  opacity: 0;
  -webkit-animation: fadeIn ease-in 1;
  -moz-animation: fadeIn ease-in 1;
  animation: fadeIn ease-in 1;

  -webkit-animation-fill-mode: forwards;
  -moz-animation-fill-mode: forwards;
  animation-fill-mode: forwards;

  -webkit-animation-duration: 1s;
  -moz-animation-duration: 1s;
  animation-duration: 1s;
}

.fadeIn.first {
  margin-bottom: 40px;
  -webkit-animation-delay: 0.4s;
  -moz-animation-delay: 0.4s;
  animation-delay: 0.4s;
}

.fadeIn.second {
  -webkit-animation-delay: 0.6s;
  -moz-animation-delay: 0.6s;
  animation-delay: 0.6s;
}

.fadeIn.third {
  -webkit-animation-delay: 0.8s;
  -moz-animation-delay: 0.8s;
  animation-delay: 0.8s;
}

.fadeIn.fourth {
  -webkit-animation-delay: 1s;
  -moz-animation-delay: 1s;
  animation-delay: 1s;
}

/* Simple CSS3 Fade-in Animation */
.underlineHover:after {
  display: block;
  left: 0;
  bottom: -10px;
  width: 0;
  height: 2px;
  background-color: #56baed;
  content: "";
  transition: width 0.2s;
}

.underlineHover:hover {
  color: #0d0d0d;
}

.underlineHover:hover:after {
  width: 100%;
}


/* OTHERS */

*:focus {
  outline: none;
}

#icon {
  width: 60%;
}

* {
  box-sizing: border-box;
}


.login-with-google-btn {
  transition: background-color .3s, box-shadow .3s;

  padding: 12px 16px 12px 42px;
  border: none;
  border-radius: 3px;
  box-shadow: 0 -1px 0 rgba(0, 0, 0, .04), 0 1px 1px rgba(0, 0, 0, .25);

  color: #757575;
  font-size: 14px;
  font-weight: 500;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;

  background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4=);
  background-color: white;
  background-repeat: no-repeat;
  background-position: 12px 11px;

  &:hover {

  }

  &:active {
    background-color: #eeeeee;
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    filter: grayscale(100%);
    background-color: #ebebeb;

    cursor: not-allowed;
  }
}


body {
  text-align: center;
  padding-top: 2rem;
}

.bbbd-btn {
  transition: background-color .3s, box-shadow .3s;

  padding: 12px 16px;
  margin-bottom: 13px;
  border: none;
  border-radius: 3px;
  box-shadow: 0 -1px 0 rgba(0, 0, 0, .04), 0 1px 1px rgba(0, 0, 0, .25);

  color: #757575;
  font-size: 14px;
  font-weight: 500;

  background-image: url(/lock.png);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  background-color: white;
  background-repeat: no-repeat;
  background-position: 12px 11px;

  &:hover {

  }

  &:active {
    background-color: #eeeeee;
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    filter: grayscale(100%);
    background-color: #ebebeb;

    cursor: not-allowed;
  }
}


body {
  text-align: center;
  padding-top: 2rem;
}

.error-message {
  color: red;
  margin-top: 5px;
  font-size: 12px;
}



</style>
