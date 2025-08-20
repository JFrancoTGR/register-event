// selector.js

const radios = document.querySelectorAll('input[name="client-type"]');
const dateOptions = document.querySelectorAll('.fecha-opcion');
const inputDate = document.getElementById('fechaSeleccionada');
const form = document.getElementById('miFormulario');

function updateDate(clientType) {
  let defaultDate = null;

  dateOptions.forEach(option => {
    const date = option.getAttribute('data-fecha');

    if ((clientType === 'broker' && date === '3-octubre') || (clientType === 'cliente' && date === '4-octubre')) {
      option.classList.remove('bloqueada');
      defaultDate = option;
    } else {
      option.classList.add('bloqueada');
      option.classList.remove('seleccionada');
    }
  });

  const isSelected = document.querySelector('.fecha-opcion.seleccionada');
  if (!isSelected && defaultDate) {
    selectDate(defaultDate);
  }
}

function selectDate(option) {
  if (option.classList.contains('bloqueada')) return;

  dateOptions.forEach(o => o.classList.remove('seleccionada'));
  option.classList.add('seleccionada');
  inputDate.value = option.getAttribute('data-fecha');
}

radios.forEach(radio => {
  radio.addEventListener('change', () => {
    updateDate(radio.value);
  });
});

dateOptions.forEach(option => {
  option.addEventListener('click', () => {
    selectDate(option);
  });
});

// Envío personalizado con Fetch y SweetAlert2
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const type = document.querySelector('input[name="client-type"]:checked')?.value;
  const date = inputDate.value;
  const name = form.nombre.value.trim();
  const phone = form.telefono.value.trim();
  const mail = form.correo.value.trim();

  // Validación básica
  if (!type || !date || !name || !phone || !mail) {
    Swal.fire({
      icon: 'warning',
      title: 'Faltan datos',
      text: 'Por favor, completa todos los campos del formulario.',
    });
    return;
  }

  const formData = new FormData();
  formData.append('tipo', type);
  formData.append('fecha', date);
  formData.append('nombre', name);
  formData.append('telefono', phone);
  formData.append('correo', mail);

  // Deshabilitar botón mientras se envía
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Enviando...';

  fetch('mailer/enviar.php', {
    method: 'POST',
    body: formData
  })
  .then(response => {
    btn.disabled = false;
    btn.textContent = 'Enviar';
    if (response.ok) {
      form.reset();
      dateOptions.forEach(op => op.classList.remove('seleccionada'));
      Swal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        text: 'Ya tienes asegurado tu lugar en nuestro evento.',
      });
    } else {
      throw new Error('Error en el servidor');
    }
  })
  .catch(error => {
    console.error(error);
    btn.disabled = false;
    btn.textContent = 'Enviar';
    Swal.fire({
      icon: 'error',
      title: 'Error al enviar',
      text: 'Ocurrió un problema al enviar tus datos. Intenta de nuevo más tarde.',
    });
  });
});
