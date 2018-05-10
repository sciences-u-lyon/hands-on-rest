describe('/tv-shows API', () => {
  beforeEach(() => {
    cy.request('POST', '/db/seed');
  });

  it('should load 8 TV shows', () => {
    cy.request('/tv-shows')
      .its('body')
      .should('have.length', 8);
  });

  it('should load a TV show by its id', () => {
    cy.request('/tv-shows/1')
      .its('body')
      .should('deep.eq', {
        id: '1',
        title: 'Black Mirror',
        poster: '/img/black-mirror.jpg',
        release: '2011-12-04T00:00:00Z',
        genres: [
          'drama',
          'sci-fi',
          'thriller'
        ]
      });
  });

  it('should load TV shows by their genres', () => {
    cy.request('/tv-shows?genres=sci-fi,horror')
      .its('body')
      .should(tvShows => {
        const titles = tvShows.map(tvShow => tvShow.title);
        const expectedTitles = ['Black Mirror', 'Stranger Things', 'The Walking Dead', 'Westworld'];
        expect(titles).to.deep.eq(expectedTitles);
      });
  });

  it('should create a new TV show', () => {
    const newTvShow = {
      title: 'Silicon Valley',
      release: '2014-04-06T00:00:00Z',
      genres: [
        'comedy'
      ]
    };
    cy.request('POST', '/tv-shows', newTvShow)
      .its('body')
      .should(tvShow => {
        expect(tvShow.id).to.not.be.empty;
        expect(tvShow.title).to.eq('Silicon Valley');
        expect(tvShow.release).to.eq('2014-04-06T00:00:00Z');
        expect(tvShow.genres).to.deep.eq(['comedy']);
      });
  });

  it('should update a TV show', () => {
    const abstract = `An anthology series exploring a twisted, high-tech world where humanity's greatest innovations and darkest instincts collide.`;
    const newTvShow = {
      id: '1',
      title: 'Black Mirror',
      poster: '/img/black-mirror.jpg',
      release: '2011-12-04T00:00:00Z',
      genres: [
        'drama',
        'sci-fi',
        'thriller'
      ],
      abstract
    };
    cy.request('PUT', '/tv-shows/1', newTvShow);
    cy.request('/tv-shows/1')
      .its('body')
      .should('have.property', 'abstract', abstract);
  });

  it('should delete a TV show', () => {
    cy.request('DELETE', '/tv-shows/1');
    cy.request('/tv-shows')
      .its('body')
      .should('have.length', 7);
  });
});
