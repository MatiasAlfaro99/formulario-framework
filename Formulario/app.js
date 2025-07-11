
$(document).ready(function() {

    if ($('#loadDataBtn').length) {
        let dataTableInstance;

        function loadTable(dataType) {
            const apiUrl = `https://jsonplaceholder.typicode.com/${dataType}`;

            if (dataTableInstance) {
                dataTableInstance.destroy();
                $('#dataTable').empty();
            }
            
            $.ajax({
                url: apiUrl,
                method: 'GET',
                success: function(data) {
                    let columns = [];

                    if (dataType === 'users') {
                        columns = [
                            { data: 'id', title: 'ID' },
                            { data: 'name', title: 'Nombre' },
                            { data: 'username', title: 'Usuario' },
                            { data: 'email', title: 'Email' },
                            { data: 'address.city', title: 'Ciudad' }, 
                            { data: 'company.name', title: 'Compañía' },
                            { data: 'website', title: 'Sitio Web' }
                        ];
                    } else if (dataType === 'posts') {
                        columns = [
                            { data: 'id', title: 'ID' },
                            { data: 'userId', title: 'User ID' },
                            { data: 'title', title: 'Título' },
                            { data: 'body', title: 'Contenido' }
                        ];
                    } else if (dataType === 'comments') {
                        columns = [
                            { data: 'id', title: 'ID' },
                            { data: 'postId', title: 'Post ID' },
                            { data: 'name', title: 'Nombre' },
                            { data: 'email', title: 'Email' },
                            { data: 'body', title: 'Comentario' }
                        ];
                    } else {
                        if (data.length > 0) {
                            const keys = Object.keys(data[0]);
                            columns = keys.map(key => ({ title: key.charAt(0).toUpperCase() + key.slice(1), data: key }));
                        } else {
                            columns = [{ title: 'No hay datos disponibles', data: null }];
                        }
                    }

                    dataTableInstance = $('#dataTable').DataTable({
                        data: data,
                        columns: columns,
                        responsive: true,
                        language: {
                            search: "Buscar:",
                            lengthMenu: "Mostrar _MENU_ registros",
                            info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
                            paginate: {
                                first: "Primero",
                                last: "Último",
                                next: "Siguiente",
                                previous: "Anterior"
                            },
                            zeroRecords: "No se encontraron resultados",
                            infoEmpty: "No hay registros disponibles",
                            infoFiltered: "(filtrado de _MAX_ registros totales)"
                        }
                    });
                },
                error: function(xhr, status, error) {
                    console.error("Error al cargar los datos:", status, error, xhr);
                    if (dataTableInstance) {
                        dataTableInstance.destroy();
                    }
                    $('#dataTable').html('<thead><tr><th>Error</th></tr></thead><tbody><tr><td>No se pudieron cargar los datos. Por favor, intente de nuevo.</td></tr></tbody>');
                }
            });
        }

        $('#loadDataBtn').on('click', function() {
            const selectedData = $('#dataType').val();
            loadTable(selectedData);
        });

        $('#dataType').on('change', function() {
            const selectedData = $(this).val();
            loadTable(selectedData);
        });


        loadTable('users');
    }


    if ($('#userForm').length) {
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        function isValidDate(dateString) {
            const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
            return dateRegex.test(dateString);
        }

        function validateForm() {
            let isValid = true;
            $('.form-control').removeClass('is-invalid');

            if ($('#nombre').val().trim() === '') {
                $('#nombre').addClass('is-invalid');
                isValid = false;
            }
            if ($('#usuario').val().trim() === '') {
                $('#usuario').addClass('is-invalid');
                isValid = false;
            }
            if ($('#email').val().trim() === '' || !isValidEmail($('#email').val())) {
                $('#email').addClass('is-invalid');
                isValid = false;
            }
            if ($('#fechaIngreso').val().trim() === '' || !isValidDate($('#fechaIngreso').val())) {
                $('#fechaIngreso').addClass('is-invalid');
                isValid = false;
            }
            return isValid;
        }
        


        $('#userForm').on('submit', function(event) {
            event.preventDefault(); 
            if (validateForm()) {

                const messageBox = $('<div class="alert alert-success alert-dismissible fade show" role="alert">¡Datos guardados correctamente! (Simulación)<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>');
                $('.container.mt-5').prepend(messageBox); 
                setTimeout(() => messageBox.alert('close'), 3000); 

                $('#userForm')[0].reset(); 
                $('.form-control').removeClass('is-invalid'); 
            }
        });

        $('#cancelBtn').on('click', function() {
            $('#userForm')[0].reset(); 
            $('.form-control').removeClass('is-invalid'); 
        });

        $('.form-control[required]').on('blur', function() {
             if ($(this).val().trim() !== '') {
                 if (this.id === 'email' && !isValidEmail($(this).val())) {
                     $(this).addClass('is-invalid');
                 } else if (this.id === 'fechaIngreso' && !isValidDate($(this).val())) {
                     $(this).addClass('is-invalid');
                 } else {
                     $(this).removeClass('is-invalid');
                 }
             } else {
                 $(this).addClass('is-invalid'); 
             }
        });

        $('.form-control[required]').on('input', function() {
            if ($(this).val().trim() !== '') {
                $(this).removeClass('is-invalid');
            }
        });
    }
});
