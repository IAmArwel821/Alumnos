import { app } from "./firebase.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  signInAnonymously,
  GithubAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

let user = null;

const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  const container = document.querySelector("#container");
  checarEstado(user);
  if (user) {
    container.innerHTML= `<h1>${user.email}</h1>
        <button class="btn btn-outline-info me-2 btn-lg float-end m-2" data-bs-toggle="modal"  id="btnAgregarAlumno" data-bs-target="#agregarModal"><i class="bi bi-person-plus m-2"></i>Agregar</button>
        <br><br>
        <table class="table table-hover table-bordered border-white">
            <thead class="table-light">
                <tr>
                    <th scope="col"><center>NUMERO DE CONTROL</th>
                    <th scope="col"><center>NOMBRE</th>
                    <th scope="col"><center>APELLIDO PATERNO</th>
                    <th scope="col"><center>APELLIDO MATERNO</th>
                    <th scope="col"><center>CARRERA</th>
                    <th scope="col"><center>GRADO DE ESTUDIOS</th>
                    <th scope="col"><center>ELIMINAR</th>
                    <th scope="col"><center>EDITAR</th>
                    <th scope="col"><center>CODIGO QR</th>
                </tr>
            </thead>
            <tbody id="listas">

            </tbody>
        </table>
        `;
    const uid = user.uid;
  } else {
    container.innerHTML = `<h1>INICIA SESION CON EMAIL, GOOGLE, GITHUB O ANONIMO</h1>`;
  }
});



const btnAnonimo=document.querySelector("#btnAnonimo");
btnAnonimo.addEventListener('click', async(e)=>{
  e.preventDefault();
  try {
    const result=await signInAnonymously(auth);
    console.log(result);
    user=result.user;
    bootstrap.Modal.getInstance(document.getElementById('iniciarModal')).hide();
  }catch (error) {
   Swal.fire('ERROR AL INICIAR CON ANONIMO') 
  }
});


const btnFon=document.querySelector("#btnFon");
btnFon.addEventListener('click', async(e)=>{
  e.preventDefault();
  try{
    const { value: tel } = await Swal.fire({
      title: 'INGRESE UN NUMERO DE TELEFONO',
      input: 'tel',
      inputLabel: 'Telefono',
      inputValue: '+525576904375',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d53',
      confirmButtonText: 'ENVIAR CODIGO',
      showCancelButton: true,
    })
    window.recaptchaVerifier = new RecaptchaVerifier('recaptcha', {
      'size': 'invisible' }, auth);
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, tel, appVerifier)
      console.log(confirmationResult);
      window.confirmationResult = confirmationResult;


      const { value: code } = await Swal.fire({
      title: 'INGRESE EL CODIGO DE VERIFICACION',
      input: 'text',
      inputLabel: 'codigo',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'cancelar',
      confirmButtonText: 'verificar',
      showCancelButton: true,
      })

      const result = await window.confirmationResult.confirm(code)
      user=result.user;
      console.log(user);
      checarEstado(user)

  } catch (error) {
    Swal.fire('ERROR AL INICIAR SESION CON TELEFONO');
  }
});




const btnGit = document.querySelector("#btnGit");
btnGit.addEventListener("click", async (e) => {
  e.preventDefault();
  const provider = new GithubAuthProvider();
  try {
    const credentials = await signInWithPopup(auth, provider)
    user=credentials.user;
    const modalInstance = bootstrap.Modal.getInstance(btnGit.closest('.modal'));
    modalInstance.hide();
    checarEstado(user)

  } catch (error) {
    console.log(error);
  }
});


const btnGoogle = document.querySelector("#btnGoogle");
btnGoogle.addEventListener("click", async (e) => {
  e.preventDefault();
  const provider = new GoogleAuthProvider();
  try {
    const credentials = await signInWithPopup(auth, provider)
    user=credentials.user;
    const modalInstance = bootstrap.Modal.getInstance(btnGoogle.closest('.modal'));
    modalInstance.hide();
    checarEstado(user)

  } catch (error) {
    console.log(error);
  }
});

const checarEstado = (user = null) => {
  console.log(user);
  if (user == null) {
    document.querySelector("#iniciar").style.display = "block";
    document.querySelector("#crear").style.display = "block";
    document.querySelector("#btnCerrarSesion").style.display = "none";
  } else {
    document.querySelector("#iniciar").style.display = "none";
    document.querySelector("#crear").style.display = "none";
    document.querySelector("#btnCerrarSesion").style.display = "block";
  }
};

const btnCerrarSesion = document.querySelector("#btnCerrarSesion");
btnCerrarSesion.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    await signOut(auth);
    checarEstado();
  } catch (error) {
    console.log(error);
  }
});

const btnIniciarSesion = document.querySelector("#btnIniciarSesion");
btnIniciarSesion.addEventListener("click", async (e) => {
  e.preventDefault();
  const email = document.querySelector("#IniciarEmail");
  const password = document.querySelector("#IniciarPassword");
  try {
    const res = await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
    user = res.user;
    Swal.fire("BIENVENIDO");
    var myModalEl = document.getElementById("iniciarModal");
    var modal = bootstrap.Modal.getInstance(myModalEl);
    modal.hide();
  } catch (error) {
    Swal.fire("USUARIO Y/O CONTRASEÑA INCORRCTA");
  }
});

const btnCrearCuenta = document.querySelector("#btnCrearCuenta");
btnCrearCuenta.addEventListener("click", async (e) => {
  e.preventDefault();
  const email = document.querySelector("#crearEmail");
  const password = document.querySelector("#crearPassword");
  //console.log(email.value, password.value);
  var myModalEl = document.getElementById("crearModal");
  var modal = bootstrap.Modal.getInstance(myModalEl);
  try {
    const respuesta = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
    //console.log(respuesta.user);
    Swal.fire({
      Icon: "success",
      title: "Es correcto!!!",
      text: "La cuenta se registro correctamente",
    });
    email.value = "";
    password.value = "";
    modal.hide();
  } catch (error) {
    console.log(error.code);
    const code = error.code;
    if (code == "auth/invalid-email") {
      Swal.fire("CORREO ELECTRONICO INAVALIDO");
    }
    if (code == "auth/invalid-password") {
      Swal.fire("CORREO ELECTRONICO INAVALIDO");
    }
    if (code == "auth/email-already-in-use") {
      Swal.fire("CORREO ELECTRONICO YA ESTA EN USO!!!");
    }
  }
});
