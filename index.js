const categoryContainer = document.getElementById('categoryContainer')
const cardContsiner = document.getElementById('cardContsiner')
const cartContainer = document.getElementById('cartContainer')
const cartTotal = document.getElementById('cartTotal')

let cart = {}


const renderCart = () => {
  cartContainer.innerHTML = ''

  let total = 0
  for (const id in cart) {
    const item = cart[id]
    total += item.price * item.quantity

    const cartItem = document.createElement('div')
    cartItem.className = 'flex justify-between bg-green-100 p-5 rounded items-center'

    cartItem.innerHTML = `
      <div>
        <h1 class="text-2xl font-semibold">${item.name}</h1>
        <h2 class="text-2xl font-semibold text-gray-400">৳${item.price} x ${item.quantity}</h2>
      </div>
      <div>
        <button class="hover:bg-green-300 rounded remove-btn" data-id="${id}">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    `

    cartContainer.appendChild(cartItem)
  }

  cartTotal.textContent = `Total: ৳${total}`


  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id
      delete cart[id] 
      renderCart()     
    })
  })
}


const addToCart = (plant) => {
  if (cart[plant.id]) {
    cart[plant.id].quantity += 1
  } else {
    cart[plant.id] = {
      ...plant,
      quantity: 1
    }
  }
  renderCart()
}

const loadPlantDetails = async (id) => {
  const url = `https://openapi.programming-hero.com/api/plant/${id}`
  const res = await fetch(url)
  const details = await res.json()
  displayDetails(details.plants)
}

const displayDetails = (plant) => {
  const detailsBox = document.getElementById('details-container')
  detailsBox.innerHTML = `
    <div class="p-4 space-y-4">
      <h1 class="font-bold text-2xl">${plant.name}</h1>
      <img class="h-48 w-full object-cover rounded" src="${plant.image}" alt="">
      <p>${plant.description}</p>
      <div class="flex justify-between">
        <button class="bg-green-200 p-1 rounded-2xl px-2 font-semibold text-green-800">${plant.category}</button>
        <h1 class="text-2xl font-semibold">৳${plant.price}</h1>
      </div>
    </div>
  `
  document.getElementById('my_modal_5').showModal()
}

// Load Categories
const LoadCategory = () => {
  fetch("https://openapi.programming-hero.com/api/categories")
    .then(res => res.json())
    .then((data) => {
      const categories = data.categories
      sowCategory(categories)
    })
}

const sowCategory = (categories) => {
  categories.forEach(cat => {
    categoryContainer.innerHTML += `
      <button id="${cat.id}" class="w-full text-left px-4 py-2 hover:bg-[#15803d] hover:text-white rounded">
        ${cat.category_name}
      </button>
    `
  })

  categoryContainer.addEventListener('click', (e) => {
    const AllBtn = document.querySelectorAll('#categoryContainer button')

    AllBtn.forEach(button => {
      button.classList.remove('bg-[#15803d]', 'text-white')
    })

    if (e.target.localName === 'button') {
      e.target.classList.add('bg-[#15803d]', 'text-white')
      loadPlants(e.target.id)
    }
  })
}

const loadPlants = (categoryId) => {
  fetch(`https://openapi.programming-hero.com/api/category/${categoryId}`)
    .then(res => res.json())
    .then(data => {
      sawCardByPlants(data.plants)
    })
    .catch(err => {
      console.log(err)
    })
}

const loadDefaultPlants = () => {
  fetch("https://openapi.programming-hero.com/api/plants")
    .then(res => res.json())
    .then(data => {
      sawCardByPlants(data.plants)
    })
    .catch(err => {
      console.log(err)
    })
}

const sawCardByPlants = (plants) => {
  cardContsiner.innerHTML = ""
  plants.forEach(plant => {
    cardContsiner.innerHTML += `
      <div class="card bg-base-100 p-4 flex flex-col h-full">
        <figure>
          <img class="h-48 w-full object-cover rounded" src="${plant.image}" alt="${plant.name}" />
        </figure>
        
        <div class="space-y-2 mb-1 flex-1 flex flex-col">
          <h2 onclick="loadPlantDetails(${plant.id})" class="card-title font-bold cursor-pointer">${plant.name}</h2>
          <p class="flex-1">${plant.description}</p>
          
          <div class="flex justify-between items-center">
            <button class="bg-green-200 p-1 rounded-2xl px-2 font-semibold text-green-800">${plant.category}</button>
            <h1 class="text-2xl font-semibold">৳${plant.price}</h1>
          </div>
          
          <button class="btn btn-primary w-full rounded-4xl bg-green-800 mt-4 add-to-cart-btn" data-id="${plant.id}">Add to Cart</button>
        </div>
      </div>
    `
  })


  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id
      const plant = plants.find(p => p.id == id)
      if (plant) {
        addToCart(plant)
      }
    })
  })
}

window.onload = () => {
  loadDefaultPlants()
  LoadCategory()
  renderCart()  
}
