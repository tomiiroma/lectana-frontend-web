
import "./CardLibro.css"

function CardLibro() {
  return (
   <div class="card">
  <div class="card-image">
    <img src="https://fakeimg.pl/350x200/?text=World&font=lobster"/>
    <div class="card-badge">Disponible en la App</div>
  </div>
  <div class="card-content">
    <h3 class="card-title">El Principito</h3>
    <p class="card-author">Antoine de Saint-Exupéry</p>
    <div class="card-info">
      <span class="card-age">8-12 años</span>
      <div class="card-stats">
        <span class="card-rating">4.9</span>
        <span class="card-duration">45 min</span>
      </div>
    </div>
    <p class="card-description">
      Una historia poética sobre un pequeño príncipe que viaja por distintos planetas reflexionando sobre la vida, la amistad y el amor.
    </p>
    <button class="card-button">Disponible para leer en la app móvil</button>
  </div>
</div>

  )
}

export default CardLibro