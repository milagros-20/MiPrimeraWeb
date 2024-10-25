function buscar() {
    const query = document.getElementById('inputBuscador').value.toLowerCase();
    const resultadosDiv = document.getElementById('resultados');
    resultadosDiv.innerHTML = ''; // Limpiar resultados previos

    const datos = [
        'Ejemplo 1',
        'Ejemplo 2',
        'Prueba de búsqueda',
        'Buscar aquí',
        'Más ejemplos'
    ];

    const resultados = datos.filter(item => item.toLowerCase().includes(query));
    
    if (resultados.length > 0) {
        resultados.forEach(item => {
            const div = document.createElement('div');
            div.textContent = item;
            resultadosDiv.appendChild(div);
        });
    } else {
        resultadosDiv.textContent = 'No se encontraron resultados.';
    }
}