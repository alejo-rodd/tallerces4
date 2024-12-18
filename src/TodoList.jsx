import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';
import { FaInfoCircle } from 'react-icons/fa';

const TodoList = () => {
    const [saldoInicial, setSaldoInicial] = useState('');
    const [saldoGuardado, setSaldoGuardado] = useState(0);
    const [active, setActive] = useState(false);
    const [arrayTodo, setArrayTodo] = useState([]);
    const [filtro, setFiltro] = useState('Todos');
    const [busqueda, setBusqueda] = useState('');
    const [controllerForm, setControllerForm] = useState({ id: '', titulo: '', valor: '', estado: 'Ingreso' });
    const [arrayEdit, setArrayEdit] = useState(null);

    // useEffect para cargar saldo inicial desde el almacenamiento local (si existe)
    useEffect(() => {
        const saldoGuardadoLocal = localStorage.getItem('saldoGuardado');
        if (saldoGuardadoLocal) {
            setSaldoGuardado(parseFloat(saldoGuardadoLocal));
            setActive(true);
        }
    }, []);

    const mostrarModal = (icon, title, text) => {
        Swal.fire({ icon, title, text, confirmButtonText: 'Aceptar' });
    };

    const handleSubmitList = (e) => {
        e.preventDefault();
        const lastMov = parseFloat(controllerForm.valor);

        if (controllerForm.estado === 'Gasto' && lastMov > saldoGuardado) {
            mostrarModal('error', 'Error', 'El saldo inicial es menor al gasto');
            return;
        }

        if (arrayEdit !== null) {
            const updatedMovements = [...arrayTodo];
            const todo = updatedMovements.find(todo => todo.id === arrayEdit);
            const saldoPrevio = todo.estado === 'Gasto' ? saldoGuardado + parseFloat(todo.valor) : saldoGuardado - parseFloat(todo.valor);
            const saldoNuevo = controllerForm.estado === 'Gasto' ? saldoPrevio - lastMov : saldoPrevio + lastMov;
            setSaldoGuardado(saldoNuevo);

            todo.estado = controllerForm.estado;
            todo.titulo = controllerForm.titulo;
            todo.valor = controllerForm.valor;
            setArrayTodo(updatedMovements);
            setArrayEdit(null);
            mostrarModal('success', 'Actualizado', 'Movimiento editado correctamente');
        } else {
            if (controllerForm.titulo && controllerForm.valor > 0) {
                const nuevoMovimiento = { ...controllerForm, id: uuidv4() };
                const newSaldo = controllerForm.estado === 'Gasto' ? saldoGuardado - lastMov : saldoGuardado + lastMov;
                setSaldoGuardado(newSaldo);
                setArrayTodo([...arrayTodo, nuevoMovimiento]);
                setActive(true);
                mostrarModal('success', 'Guardado', `El ${controllerForm.estado} se registró correctamente.`);
            } else {
                mostrarModal('error', 'Error', 'Verifique los valores ingresados');
            }
        }
        setControllerForm({ titulo: '', valor: '', estado: 'Ingreso' });
    };

    const handleSubmitDelete = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'No podrás revertir esta acción.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                const movimiento = arrayTodo.find(todo => todo.id === id);
                const saldoActualizado = movimiento.estado === 'Gasto' ? saldoGuardado + parseFloat(movimiento.valor) : saldoGuardado - parseFloat(movimiento.valor);
                setSaldoGuardado(saldoActualizado);
                setArrayTodo(arrayTodo.filter(todo => todo.id !== id));
                mostrarModal('success', 'Eliminado', 'El movimiento ha sido eliminado');
            }
        });
    };

    const handleSubmitEdit = (id) => {
        const movimiento = arrayTodo.find(todo => todo.id === id);
        setControllerForm({ titulo: movimiento.titulo, valor: movimiento.valor, estado: movimiento.estado });
        setArrayEdit(id);
    };

    const handleChangeIngreso = ({ target }) => {
        setControllerForm({ ...controllerForm, [target.name]: target.value });
    };

    const handleSubmitSaldo = (e) => {
        e.preventDefault();
        setSaldoGuardado(saldoInicial ? parseFloat(saldoInicial) : 0);
        setActive(true);
        localStorage.setItem('saldoGuardado', saldoInicial); // Guardar saldo en localStorage
        mostrarModal('success', 'Guardado', 'Saldo inicial registrado con éxito');
    };

    const handleChangeSald = (e) => {
        setSaldoInicial(e.target.value);
    };

    const movimientosFiltrados = arrayTodo.filter(mov => {
        const coincideNombre = mov.titulo.toLowerCase().includes(busqueda.toLowerCase());
        const coincideFiltro = filtro === 'Todos' || mov.estado === filtro;
        return coincideNombre && coincideFiltro;
    });

    return (
        <div className="container-fluid vh-100 p-3">
            <form className="p-3 form-control shadow rounded mb-4" onSubmit={handleSubmitSaldo}>
                <h3>Ingrese su saldo inicial</h3>
                <div className="d-flex justify-content-between">
                    <input className="form-control w-25" type="number" placeholder="Saldo inicial" onChange={handleChangeSald} value={saldoInicial} disabled={active} />
                    <input className="form-control w-25" disabled placeholder="Saldo final" value={saldoGuardado.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })} />
                    <button className="btn btn-success" type="submit">Guardar</button>
                </div>
            </form>

            <div className="text-center mb-3">
                <h5>Total de movimientos: {arrayTodo.length}</h5>
            </div>

            <div className="d-flex gap-3">
                <form className="form-control shadow rounded w-50" onSubmit={handleSubmitList} onChange={handleChangeIngreso}>
                    <h4>Registrar Movimiento</h4>
                    <select className="form-control" name="estado" value={controllerForm.estado} onChange={handleChangeIngreso}>
                        <option value="Ingreso">Ingreso</option>
                        <option value="Gasto">Gasto</option>
                    </select>
                    <input className="form-control mt-2" type="text" placeholder="Nombre" name="titulo" value={controllerForm.titulo} />
                    <input className="form-control mt-2" type="number" placeholder="$ Cantidad" name="valor" value={controllerForm.valor} />
                    <button className="btn btn-primary mt-3">Guardar</button>
                </form>

                <div className="form-control shadow rounded w-50">
                    <h4>Movimientos</h4>
                    <input className="form-control mb-2" type="text" placeholder="Buscar" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
                    <select className="form-control mb-2" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
                        <option value="Todos">Todos</option>
                        <option value="Ingreso">Ingreso</option>
                        <option value="Gasto">Gasto</option>
                    </select>
                    {movimientosFiltrados.map((mov) => (
                        <div key={mov.id} className="d-flex justify-content-between align-items-center mb-2">
                            <span><FaInfoCircle title={`ID: ${mov.id}`} className="me-2" />{mov.titulo}</span>
                            <span className={`badge ${mov.estado === 'Gasto' ? 'bg-danger' : 'bg-success'}`}>${parseFloat(mov.valor).toLocaleString('es-CO')}</span>
                            <div>
                                <button className="btn btn-warning me-2" onClick={() => handleSubmitEdit(mov.id)}>Editar</button>
                                <button className="btn btn-danger" onClick={() => handleSubmitDelete(mov.id)}>Eliminar</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TodoList;
