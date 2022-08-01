import Swal from 'sweetalert2';

export const showError = (title: string, text = '') => {
  Swal.fire({ title, text, icon: 'error' });
};

export function showOk(title: string, text = '') {
  Swal.fire({ title, text, icon: 'success', timer: 3000 });
}
