class Api {
  constructor(options) {
    this._url = options.url;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  _fetch(path, method, data) {
    let body = data;
    if ((method === 'PATCH' || method === 'POST') && data) {
      body = JSON.stringify(data);
    }

    return fetch(this._url + path, {
      method,
      headers: {
        authorization: `Bearer ${localStorage.getItem('JWT')}`,
        'Content-Type': 'application/json',
      },
      body,
    }).then(this._checkResponse);
  }

  getUserInfo() {
    return this._fetch('/users/me', 'GET');
  }

  setUserInfo(data) {
    return this._fetch('/users/me', 'PATCH', data);
  }

  addNewCard(data) {
    return this._fetch('/cards', 'POST', data);
  }

  getInitialCards() {
    return this._fetch('/cards', 'GET');
  }

  likeCard(id) {
    return this._fetch(`/cards/${id}/likes`, 'PUT');
  }

  dislikeCard(id) {
    return this._fetch(`/cards/${id}/likes`, 'DELETE');
  }

  changeLikeCardStatus(id, hasLike) {
    if (!hasLike) {
      return api.likeCard(id);
    }
    return api.dislikeCard(id);
  }

  deleteCard(id) {
    return this._fetch(`/cards/${id}`, 'DELETE');
  }

  setUserAvatar(data) {
    return this._fetch(`/users/me/avatar`, 'PATCH', data);
  }

  getAllData() {
    return Promise.all([this.getUserInfo(), this.getInitialCards()]);
  }
}

export const api = new Api({
  url: `https://api.mesto-front.ruslan-z.nomoredomains.work`,
});
