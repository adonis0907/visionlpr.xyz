export const adminNav = {
  items: [
      {
        name: 'Dashboard',
          url: '/dashboard',
          icon: 'icon-speedometer',
      },
      {
          name: 'Cidade',
          icon: 'icon-map',
          children: [
              {
                  name: 'Novo Cidade',
                  url: '/city/create',
              },
              {
                  name: 'Cidades',
                  url: '/city/all',
              }
          ],
      },
      {
          name: 'Estação',
          icon: 'fa fa-map-pin',
          children: [
              {
                  name: 'Novo Estação',
                  url: '/station/create',
              },
              {
                  name: 'Estaçãos',
                  url: '/station/all',
              }
          ],
      },
      {
          name: 'Câmera',
          icon: 'fa fa-video-camera',
          children: [
              {
                  name: 'Novo Câmera',
                  url: '/camera/create',
              },
              {
                  name: 'Câmeras',
                  url: '/camera/all',
              }
          ],
      },
      {
          name: 'Alerta',
          icon: 'icon-bell',
          children: [
              {
                  name: 'Novo Alerta',
                  url: '/alert/create',
              },
              {
                  name: 'Alertas',
                  url: '/alert/all',
              }
          ],
      },
      {
          name: 'Veículos',
          url: '/vehicle/all',
          icon: 'fa fa-automobile',
      },
      {
          name: 'Tempo Real',
          url: '/realtime',
          icon: 'icon-feed',
      },
      {
          name: 'Mapa',
          icon: 'cui-location-pin',
          url: '/map/camera'
      },
      {
          name: 'Pesquisa',
          icon: 'icon-magnifier',
          url: '/search'
      },
      {
          name: 'veículo seguidor',
          icon: 'fa fa-automobile',
          url: '/companion',
      },
      {
          name: 'Histórico',
          icon: 'fa fa-automobile',
          url: '/log',
      },
      {
          name: 'Usuário',
          icon: 'icon-user',
          children: [
              {
                  name: 'Novo usuário',
                  url: '/user/create',
              },
              {
                  name: 'Usuários',
                  url: '/user/all',
              }
          ],
      }
  ]
};

export const userNav = {
    items: [
        {
            name: 'Dashboard',
            url: '/dashboard',
            icon: 'icon-speedometer',
        },
        {
            name: 'Cidade',
            icon: 'icon-map',
            children: [
                {
                    name: 'Novo Cidade',
                    url: '/city/create',
                },
                {
                    name: 'Cidades',
                    url: '/city/all',
                }
            ],
        },
        {
            name: 'Estação',
            icon: 'fa fa-map-pin',
            children: [
                {
                    name: 'Novo Estação',
                    url: '/station/create',
                },
                {
                    name: 'Estaçãos',
                    url: '/station/all',
                }
            ],
        },
        {
            name: 'Câmera',
            icon: 'fa fa-video-camera',
            children: [
                {
                    name: 'Novo Câmera',
                    url: '/camera/create',
                },
                {
                    name: 'Câmeras',
                    url: '/camera/all',
                }
            ],
        },
        {
            name: 'Alerta',
            icon: 'icon-bell',
            children: [
                {
                    name: 'Novo Alerta',
                    url: '/alert/create',
                },
                {
                    name: 'Alertas',
                    url: '/alert/all',
                }
            ],
        },
        {
            name: 'Veículos',
            url: '/vehicle/all',
            icon: 'fa fa-automobile',
        },
        {
            name: 'Tempo Real',
            url: '/realtime',
            icon: 'icon-feed',
        },
        {
            name: 'Mapa',
            icon: 'cui-location-pin',
            url: '/map/camera'
        },
        {
            name: 'Pesquisa',
            icon: 'icon-magnifier',
            url: '/search'
        },
        {
            name: 'veículo seguidor',
            icon: 'fa fa-automobile',
            url: '/companion',
        },
    ]
};