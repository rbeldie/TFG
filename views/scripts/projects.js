document.querySelectorAll('tr').forEach(row =>{
    row.addEventListener('click', () =>{
        let id = row.dataset.href
        window.location = 'http://localhost:3000/proyectos/'+id;
    })
})