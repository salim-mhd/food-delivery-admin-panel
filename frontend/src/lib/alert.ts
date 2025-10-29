import Swal, { SweetAlertIcon } from 'sweetalert2';

export function alertSuccess(title: string, text?: string): void {
  Swal.fire({ icon: 'success', title, text, timer: 1600, showConfirmButton: false });
}

export function alertError(title: string, text?: string): void {
  Swal.fire({ icon: 'error', title, text });
}

export async function confirmDialog(title: string, text?: string, confirmButtonText = 'Yes', cancelButtonText = 'Cancel'): Promise<boolean> {
  const res = await Swal.fire({
    icon: 'warning',
    title,
    text,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText
  });
  return !!res.isConfirmed;
}

export function alertInfo(title: string, text?: string): void {
  Swal.fire({ icon: 'info' as SweetAlertIcon, title, text });
}


