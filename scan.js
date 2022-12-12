import {
  getFirestore,
  collection,
  getDocs,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  updateDoc
 } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js"
 import { app } from './firebase.js'

const db=getFirestore(app);
const coleccion=collection(db,"alumnos");



const onScanSuccess= async(qrCodeMessage) =>{
    const data = await getDoc(doc(db, "alumnos", qrCodeMessage));
    const alumno = data.data();
    document.querySelector("#result").innerHTML=`
    <table class="table table-dark table-striped>
  <thead>
    <tr>
      <th scope="col">NUMERO DE CONTROL</th>
      <th scope="col">NOMBRE</th>
      <th scope="col">APELLIDO PATERNO</th>
      <th scope="col">APELLIDO MATERNO</th>
      <th scope="col">CARRERA</th>
      <th scope="col">GRADO DE ESTUDIOS</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>${alumno.nocontrol}</td>
      <td>${alumno.nombre} ${alumno.paterno} ${alumno.materno}</td>
      <td>${alumno.carrera}</td>
      <td>${alumno.nivel}</td>
    </tr>
  </tbody>
</table>
    `;
    scan.clear();
    document.querySelector("#reader").remove();
}

const onScanError=(errorMessage)=> {
   // Swal.fire('error al escanear');
}

var scan = new Html5QrcodeScanner(
    "reader", {fps: 18, qrbox: 250});
    scan.render(onScanSuccess, onScanError);