const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 20
let offset = 0

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map((pokemon) => `
            <li class="pokemon ${pokemon.type}" onclick="showPokemonDetails(${pokemon.number})">
                <span class="number">#${pokemon.number}</span>
                <span class="name">${pokemon.name}</span>
                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>
                    <img src="${pokemon.photo}" alt="${pokemon.name}">
                </div>
                
            </li>
        `).join('')
        pokemonList.innerHTML += newHtml

        pokemons.forEach(pokemon => {
            window[`poke${pokemon.number}`] = pokemon;
        });
    })
}

function showPokemonDetails(id) {
    const pokemon = window[`poke${id}`];
    const typesHtml = pokemon.types.map(type => `<span class="type ${type}" style="
        display: inline-block;
        background-color: inherit;
        border: 1px solid #fff;
        border-radius: 1rem;
        padding: 0.25rem 0.5rem;
        margin: 0.25rem;
        color: #fff;
        font-size: 0.75rem;
        text-transform: capitalize;
    ">${type}</span>`).join(' ');


    Swal.fire({
        title: `${pokemon.name} (#${pokemon.number})`,
        html: `
            <div class="${pokemon.type}">
            <img src="${pokemon.photo}" alt="${pokemon.name}" style="width:100px;height:100px;">
            <p><strong>Type${pokemon.types.length > 1 ? 's' : ''}:</strong><br>${typesHtml}</p>
            <p><strong>Height:</strong> ${pokemon.height}</p>
            <p><strong>Weight:</strong> ${pokemon.weight}</p>
            <p><strong>Abilities:</strong> ${pokemon.abilities.join(', ')}</p>
            </div>
        `,
        confirmButtonText: 'Fechar'
    });
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    
    const qtdRecordsWithNextPage = offset + limit

    if (qtdRecordsWithNextPage >= maxRecords) {
        const  newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
   
})
