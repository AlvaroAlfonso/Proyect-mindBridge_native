document.addEventListener('DOMContentLoaded', function() {
    const headers = document.querySelectorAll('.accordion-header');

    headers.forEach(header => {
        header.addEventListener('click', function() {
            // El elemento de contenido es el siguiente hermano del header
            const content = this.nextElementSibling;
            
            // 1. Alternar la clase 'active' en el botón (para cambiar el icono)
            this.classList.toggle('active');

            // 2. Alternar la visualización del contenido
            if (content.classList.contains('show')) {
                // Si está abierto, lo cierras
                content.classList.remove('show');
                content.style.maxHeight = 0;
            } else {
                // Si está cerrado, lo abres

                // [Opcional] Cierra todos los demás ítems antes de abrir este (comportamiento de "acordeón verdadero")
                // headers.forEach(otherHeader => {
                //     if (otherHeader !== this && otherHeader.classList.contains('active')) {
                //         otherHeader.classList.remove('active');
                //         otherHeader.nextElementSibling.classList.remove('show');
                //         otherHeader.nextElementSibling.style.maxHeight = 0;
                //     }
                // });
                
                // Abre el contenido
                content.classList.add('show');
                // Establece la altura máxima para que la transición funcione
                // scrollHeight es la altura real del contenido, lo que permite la animación suave
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });
});