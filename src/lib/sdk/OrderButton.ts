document.addEventListener('DOMContentLoaded', function () {
  const serverUrl = 'https://voidpayservermvp2.onrender.com';
  //   const serverUrl = "http://localhost:3000";

  const container = document.querySelector('#void-button-container'); // Selecionando o container correto
  const errorMsg = document.getElementById('error-message');
  if (errorMsg) {
    errorMsg.style.color = 'red';
  }
  console.log('ooi');
  // Criando o botão
  const button = document.createElement('button');
  button.id = 'void-pay-button';
  button.type = 'submit';

  // Criando a imagem do ícone
  const icon = document.createElement('img');
  icon.src = 'https://raw.githubusercontent.com/VOIDabinerJR/sdk/main/void.jpg'; // Substitua pelo caminho do seu ícone
  icon.alt = 'Ícone do Void Pay';
  icon.style.width = '20%';
  icon.style.verticalAlign = 'middle'; // Ajustando o alinhamento vertical do ícone

  // Texto do botão
  const buttonText = document.createTextNode('pay');

  // Adicionando o ícone e o texto ao botão
  button.appendChild(icon);
  button.appendChild(buttonText);

  // Estilos básicos do botão
  button.style.display = 'inline-block';
  button.style.backgroundColor = '#0a0a0a';
  button.style.color = 'white';
  button.style.fontSize = '18px';
  button.style.padding = '10px 20px';
  button.style.border = 'none';
  button.style.borderRadius = '5px';
  button.style.cursor = 'pointer';
  button.style.textAlign = 'center';
  button.style.textDecoration = 'none';
  button.style.transition =
    'background-color 0.3s, box-shadow 0.3s, transform 0.1s';

  // Estilos ao focar o botão pelo cursor
  button.addEventListener('mouseenter', function () {
    button.style.backgroundColor = '#0a0a0a';
    button.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.4)';
  });

  // Removendo estilos ao desfocar o botão pelo cursor
  button.addEventListener('mouseleave', function () {
    button.style.backgroundColor = '#0a0a0a';
    button.style.boxShadow = 'none';
  });

  // Estilos ao clicar no botão
  button.addEventListener('mousedown', function () {
    button.style.backgroundColor = '#0a0a0a';
    button.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
    button.style.transform = 'translateY(2px)';
  });

  // Estilos ao soltar o clique no botão
  button.addEventListener('mouseup', function () {
    button.style.backgroundColor = '#0a0a0a';
    button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    button.style.transform = 'translateY(0)';
  });

  button.addEventListener('click', async function (event) {
    event.preventDefault();

    function extractOrderItems() {
      const items: {
        img: any;
        name: string | null;
        price: number | null;
        quantity: string | null;
        productId: string | null;
      }[] = [];
      const orderItems = document.querySelectorAll('.product-item');

      orderItems.forEach((item) => {
        const imgElement = item.querySelector('.image-item');
        const nameElement = item.querySelector('.name-item');
        const quantityElement = item.querySelector('.quantity-item');
        const priceElement = item.querySelector('.price-item');
        const idElement = item.querySelector('.id-item');

        const img =
          imgElement && imgElement instanceof HTMLImageElement
            ? imgElement.src
            : null;
        const name =
          nameElement && nameElement.textContent
            ? nameElement.textContent.trim()
            : null;
        const quantity =
          quantityElement && quantityElement.textContent
            ? quantityElement.textContent.trim()
            : null;
        const priceText =
          priceElement && priceElement.textContent
            ? priceElement.textContent.trim()
            : null;
        const productId =
          idElement && idElement.textContent
            ? idElement.textContent.trim()
            : null;

        const price = priceText ? parseFloat(priceText) : null;

        items.push({
          img: img,
          name: name,
          price: price,
          quantity: quantity,
          productId: productId
        });
      });

      return items;
    }
    const orderItems = extractOrderItems();

    const containerElement = document.getElementById('void-button-container');
    const cc = containerElement
      ? containerElement.getAttribute('buttonToken')
      : null;

    const data = {
      buttonToken: cc,
      orderItems: orderItems
    };

    try {
      const response = await fetch(`${serverUrl}/order/createOrder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      // if (!response.ok) {
      //     throw new Error('Network response was not ok');
      // }

      // Exibir a resposta  como texto
      const result = await response.json();
      console.log(result);

      if (result.status) {
        window.location.href = `${serverUrl}/pay/pay?orderid=${result.orderId}&buttontoken=${result.buttonToken}`;
        //  window.location.href = `http://localhost:3000/pay/pay?orderid=${result.orderId}&buttontoken=${result.buttonToken}`;
      } else if (!result.status) {
        if (result.error && errorMsg) {
          errorMsg.textContent = `Erro: ${result.error[0].message}`;
        }
      }
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  });

  // Adicionando o botão ao container
  if (container) {
    container.appendChild(button);
  } else {
    console.error('Container element not found. Button was not added.');
  }
});
