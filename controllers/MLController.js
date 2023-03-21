const axios = require("axios");

let MLController = function () {
  this.search = search;
  this.details = details;
};

const search = (req, res, next) => {
  axios
    .get(
      `https://api.mercadolibre.com/sites/MLA/search?q=${req.query.q}&limit=${
        req.query.limit || "4"
      }`
    )
    .then((response) => {
      const results = response.data.results.map((item) => {
        return {
          author: {
            name: item.seller.nickname,
            lastname: item.seller.nickname,
          },
          id: item.id,
          title: item.title,
          address: item.address,
          price: {
            currency: item.currency_id,
            amount: Math.trunc(item.price),
            decimals: Number(item.price.toString().split(".")[1]),
          },
          picture: item.thumbnail,
          condition: item.condition,
          free_shipping: item.shipping.free_shipping,
          categories: [item.category_id],
        };
      });

      return res.json(results);
    });
};

const details = (req, res, next) => {
  axios
    .get(`https://api.mercadolibre.com/items/${req.params.id}`)
    .then(async (response) => {
      let plainText = await getDescription(req.params.id).catch(() => "");
      let result = {
        // author: {
        //   name: response.data.seller.nickname,
        //   lastname: response.data.seller.nickname,
        // },
        id: response.data.id,
        title: response.data.title,
        price: {
          currency: response.data.currency_id,
          amount: Math.trunc(response.data.price),
          decimals: Number(response.data.price.toString().split(".")[1]),
        },
        picture: response.data.pictures[0].url,
        condition: response.data.condition,
        free_shipping: response.data.shipping.free_shipping,
        sold_quantity: response.data.sold_quantity,
        description: plainText,
      };

      return res.json(result);
    })
    .catch((error) => {
      return res.sendStatus(error.response.status);
    });
};

const getDescription = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://api.mercadolibre.com/items/${id}/description`)
      .then((response) => {
        return resolve(response.data.plain_text);
      });
  }).catch((error) => {
    return reject(error);
  });
};

exports.MLController = new MLController();
