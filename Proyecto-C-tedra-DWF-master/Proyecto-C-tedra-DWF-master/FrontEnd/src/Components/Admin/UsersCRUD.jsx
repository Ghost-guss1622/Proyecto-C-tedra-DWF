import React, { useState, useEffect } from "react";
import { useAuth } from "../Auth/AuthContext";
import {
  Box, Button, TextField, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper,
  Dialog, DialogActions, DialogContent, DialogTitle,
  Fab, TablePagination
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";

const UsersCRUD = () => {
  const { token, role } = useAuth();

  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    rol: "USER"
  })

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };

  const fetchUsers = async (page = 0, search = "") => {
    const res = await fetch(
      `http://localhost:8080/api/users/search?query=${search}&page=${page}&size=5`,
      { headers }
    );
    const data = await res.json();
    setUsers(data.content);
    setTotalPages(data.totalPages);
  };

  useEffect(() => {
    fetchUsers(page, query);
  }, [page, query]);

  const handleOpen = (user = null) => {
    setEditingUser(user);
    setForm(user || { nombre: "", apellido: "", correo: "", rol: "USER" });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    if (!validateForm()) return; // Bloquea submit si hay errores

    const url = editingUser
      ? `http://localhost:8080/api/users/${editingUser.id}`
      : `http://localhost:8080/api/users`;

    const method = editingUser ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers,
      body: JSON.stringify(form),
    });

    fetchUsers(page, query);
    handleClose();
  };


  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este usuario?")) return;

    await fetch(`http://localhost:8080/api/users/${id}`, {
      method: "DELETE",
      headers
    });

    fetchUsers(page, query);
  };

  if (role !== "ADMIN") {
    return <h3>Acceso denegado</h3>;
  }

const validateForm = () => {
  const newErrors = {};

  if (!form.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
  if (!form.apellido.trim()) newErrors.apellido = "El apellido es obligatorio";

  if (!form.correo.trim()) {
    newErrors.correo = "El correo es obligatorio";
  } else if (!/\S+@\S+\.\S+/.test(form.correo)) {
    newErrors.correo = "Formato de correo incorrecto";
  }

  if (!form.rol.trim()) newErrors.rol = "El rol es obligatorio";

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};

  return (
    <Box sx={{ p: 3 }}>
      <h2>Gestión de Usuarios</h2>

      <TextField
        label="Buscar usuarios"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setPage(0);
        }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.nombre}</TableCell>
                <TableCell>{u.apellido}</TableCell>
                <TableCell>{u.correo}</TableCell>
                <TableCell>{u.rol}</TableCell>
                <TableCell align="center">
                  <Button
                    onClick={() => handleOpen(u)}
                    startIcon={<Edit />}
                  />
                  <Button
                    color="error"
                    onClick={() => handleDelete(u.id)}
                    startIcon={<Delete />}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          rowsPerPage={5}
          page={page}
          rowsPerPageOptions={[5]}
          count={totalPages * 5}
          onPageChange={(e, newPage) => setPage(newPage)}
        />
      </TableContainer>

      {/* Botón flotante */}
      <Fab
        color="primary"
        sx={{ position: "fixed", right: 20, bottom: 20 }}
        onClick={() => handleOpen()}
      >
        <Add />
      </Fab>

      {/* Modal Crear/Editar */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editingUser ? "Editar Usuario" : "Nuevo Usuario"}
        </DialogTitle>

        <DialogContent>
          <TextField
            label="Nombre"
            fullWidth
            sx={{ mt: 2 }}
            value={form.nombre}
            onChange={(e) => {
              setForm({ ...form, nombre: e.target.value });
              validateForm();
            }}
            error={!!errors.nombre}
            helperText={errors.nombre}
          />

          <TextField
            label="Apellido"
            fullWidth
            sx={{ mt: 2 }}
            value={form.apellido}
            onChange={(e) => setForm({ ...form, apellido: e.target.value })}
          />
          <TextField
            label="Correo"
            fullWidth
            sx={{ mt: 2 }}
            value={form.correo}
            onChange={(e) => {
              setForm({ ...form, correo: e.target.value });
              validateForm();
            }}
            error={!!errors.correo}
            helperText={errors.correo}
          />

          <TextField
            label="Rol"
            fullWidth
            sx={{ mt: 2 }}
            value={form.rol}
            onChange={(e) => {
              setForm({ ...form, rol: e.target.value });
              validateForm();
            }}
            error={!!errors.rol}
            helperText={errors.rol}
          />

        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={Object.keys(errors).length > 0}
          >
            Guardar
          </Button>

        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersCRUD;
