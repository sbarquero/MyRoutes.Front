import Swal from 'sweetalert2';

export const showError = (title: string, text = '') => {
  Swal.fire({ title, text, icon: 'error', timer: 3000 });
};

export function showOk(title: string, text = '') {
  Swal.fire({ title, text, icon: 'success', timer: 3000 });
}
