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
 import { app } from "./firebase.js";

const db=getFirestore(app);
const coleccion=collection(db,"alumnos");

let editStatus = false;
let id = "";

const onGetAlumnos = (callback) => onSnapshot(coleccion, callback);


window.addEventListener("DOMContentLoaded", async (e) => {
    
    
    onGetAlumnos((querySnapshot)=>{
        const divAlumnos=document.querySelector("#listas");
        divAlumnos.innerHTML= "";
        querySnapshot.forEach((doc) => {
            const alumno = doc.data();
            divAlumnos.innerHTML += `
                <tr>
                    <td style="color:white;"><center>${alumno.nocontrol}</center></td>
                    <td style="color:white;"><center>${alumno.nombre}</center></td>
                    <td style="color:white;"><center>${alumno.apaterno}</center></td>
                    <td style="color:white;"><center>${alumno.amaterno}</center></td>
                    <td style="color:white;"><center>${alumno.carrera}</center></td>
                    <td style="color:white;"><center>${alumno.nivel}</center></td>
                    <td><center><button class="btn btn-outline-danger  btnEliminarAlumno" data-id="${doc.id}"><i class="bi bi-trash"></i></button></center></td>
                    <td><center><button class="btn btn-outline-success  btnEditarAlumno" data-bs-toggle="modal" data-bs-target="#editModal" data-id="${doc.id}"><i class="bi bi-pencil-fill"></i></button></center></td>
                    <td><center><button class="btn btn-outline-warning  btnQRAlumno" data-bs-toggle="modal" data-bs-target="#qrModal" data-id="${doc.id}"><i class="bi bi-qr-code"></i></button></center></td>
                    </tr>`;
        });

        const btnQRAlumno = document.querySelectorAll(".btnQRAlumno");
        btnQRAlumno.forEach((btn) => {
            btn.addEventListener("click", async (e) => {
                try {
                    id=btn.dataset.id;
                    console.log(id);
                    const data = await getDoc(doc(db, "alumnos", id));
                    const alumno = data.data();
                    //const numero=alumno.nocontrol;
                    const contenedorQR = document.querySelector('#contenedorQR');
                    contenedorQR.innerHTML=""
                    const QR = new QRCode(contenedorQR);
                    QR.makeCode(id);
                } catch (error) {
                    console.log(error);
                }
            });
        });


        const btnsDelete = document.querySelectorAll(".btnEliminarAlumno");
        //console.log(btnsDelete);
        btnsDelete.forEach((btn,idx) =>
            btn.addEventListener("click", () => {
                id=btn.dataset.id;
                console.log(btn.dataset.id);
                Swal.fire({
                    title: 'Estás seguro de eliminar este alumno?',
                    confirmButtonColor: '#0066FF ',
                    cancelButtonColor: '#FF0000',
                    showDenyButton: true,
                    confirmButtonText: 'SI',
                    denyButtonText: `NO`,
                }).then(async(result) => {
                    try {
                        if (result.isConfirmed) {
                            await deleteDoc(doc(db, "alumnos", id));
                            Swal.fire("REGISTRO ELIMINADO!!!");
                        }                         
                    } catch (error) {
                        Swal.fire("ERROR AL ELIMINAR REGISTRO");
                    }
                })       
            })
        );

        const btnsEdit = document.querySelectorAll(".btnEditarAlumno");
        btnsEdit.forEach((btn) => {
            btn.addEventListener("click", async (e) => {
                try {
                    id=btn.dataset.id;
                    console.log(id);
                    const data= await getDoc(doc(db, "alumnos", id));
                    const alumno = data.data();
                    document.querySelector("#enocontrol").value=alumno.nocontrol;
                    document.querySelector("#enombre").value=alumno.nombre;
                    document.querySelector("#eapaterno").value=alumno.apaterno;
                    document.querySelector("#eamaterno").value=alumno.amaterno;
                    document.querySelector("#ecarrera").value=alumno.carrera;
                    document.querySelector("#enivel").value=alumno.nivel;
                    editStatus = true;
                    id = data.id;
                } catch (error) {
                    console.log(error);
                }
            });
        });

    });
    
});

const btnAgregarAlumno=document.querySelector("#btnAgregarAlumno");
btnAgregarAlumno.addEventListener("click",()=>{
    const nocontrol=document.querySelector("#nocontrol").value;
    const nombre=document.querySelector("#nombre").value;
    const apaterno=document.querySelector("#apaterno").value;
    const amaterno=document.querySelector("#amaterno").value;
    const carrera=document.querySelector("#carrera").value;
    const nivel=document.querySelector("#nivel").value;

    if(nocontrol=="" || nombre=="" || apaterno=="" || amaterno=="" || carrera=="" || nivel==""){
        Swal.fire("falta llenar Campos");
        return;
    }

    const alumno={ nocontrol, nombre, apaterno,amaterno,carrera, nivel};

    if (!editStatus) {
        addDoc(coleccion, alumno);        
        bootstrap.Modal.getInstance(document.getElementById('agregarModal')).hide();
    } 

    Swal.fire({
        icon: 'success',
        title: 'EXITO',
        text: 'Se guardo correctamente!'
    })
    document.querySelector("#formAddAlumno").reset();
});


const btnGuardarAlumno=document.querySelector("#btnGuardarAlumno");
btnGuardarAlumno.addEventListener("click",()=>{
    const nocontrol=document.querySelector("#enocontrol").value;
    const nombre=document.querySelector("#enombre").value;
    const apaterno=document.querySelector("#eapaterno").value;
    const amaterno=document.querySelector("#eamaterno").value;
    const carrera=document.querySelector("#ecarrera").value;
    const nivel=document.querySelector("#enivel").value;

    if(nocontrol=="" || nombre=="" || apaterno=="" || amaterno=="" || carrera=="" || nivel==""){
        Swal.fire("falta llenar Campos");
        return;
     
    }

    const alumno={ nocontrol, nombre, apaterno,amaterno,carrera,nivel};

    if (editStatus) {
        updateDoc(doc(db, "alumnos", id), alumno);
        editStatus = false;
        id = "";
        bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
    }

    Swal.fire({
        icon: 'success',
        title: 'EXITO',
        text: 'Se guardo correctamente!'
    })
    document.querySelector("#formEditAlumno").reset();
});





