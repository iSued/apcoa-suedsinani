import { useEffect, useState } from 'react';
import axios from 'axios';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Grid2 as Grid, Container, TextField, Checkbox } from '@mui/material';

type Country = {
  name: {
    common: string;
    official: string;
    nativeName: {
      [key: string]: {
        official: string;
        common: string;
      };
    };
  };
  tld: string[];
  cca2: string;
  ccn3: string;
  cca3: string;
  independent: boolean;
  status: string;
  unMember: boolean;
  currencies: {
    [key: string]: {
      name: string;
      symbol: string;
    };
  };
  idd: {
    root: string;
    suffixes: string[];
  };
  capital: string[];
  altSpellings: string[];
  region: string;
  languages: {
    [key: string]: string;
  };
  translations: {
    [key: string]: {
      official: string;
      common: string;
    };
  };
  latlng: number[];
  landlocked: boolean;
  area: number;
  demonyms: {
    eng: {
      f: string;
      m: string;
    };
    fra: {
      f: string;
      m: string;
    };
  };
  flag: string;
  maps: {
    googleMaps: string;
    openStreetMaps: string;
  };
  population: number;
  car: {
    signs: string[];
    side: string;
  };
  timezones: string[];
  continents: string[];
  flags: {
    png: string;
    svg: string;
  };
  coatOfArms: {
    png: string;
    svg: string;
  };
  startOfWeek: string;
  capitalInfo: {
    latlng: number[];
  };
};

function App() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [search, setSearch] = useState('');

  // Fetching data from API https://restcountries.com/v3.1/all 
  useEffect(() => {
    if (search === '') {
      axios.get('https://restcountries.com/v3.1/all')
        .then(response => {
          setCountries(response.data);
        })
        .catch(error => {
          console.error('Error fetching countries:', error);
        });
    } else {
      axios.get(`https://restcountries.com/v3.1/name/${search}`)
        .then(response => {
          setCountries(response.data);
        })
        .catch(error => {
          console.error('Error fetching countries:', error);
        });
    }
  }, [search]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    setSearch(name);
  };

  const [favourites, setFavourites] = useState<Country[]>([]);
  
  const handleFavouriteChange = (eventData: Country) => {
    const countryName = eventData.name.common;
    const isFavourite = favourites.some(fav => fav.name.common === countryName);
  
    if (isFavourite) {
      setFavourites(favourites.filter(fav => fav.name.common !== countryName));
    } else {
      setFavourites([...favourites, eventData]);
    }
  
    console.log(favourites);
  };

  return (
    <Container style={{ minHeight: '100vh', minWidth: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f5f5f5', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '800px', position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f5f5f5' }}>
        <TextField
          label="Search Country"
          variant="outlined"
          fullWidth
          margin="normal"
          value={search}
          onChange={handleSearchChange}
          style={{ marginBottom: '2rem' }}
        />
      </div>
      <Grid container justifyContent="center" alignItems="center" style={{ width: '100%' }}>
        <TableContainer component={Paper} style={{ width: '100%', maxWidth: '800px' }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Country Name</TableCell>
                <TableCell align="right">Capital City</TableCell>
                <TableCell align="center">Favourite</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {countries.map((row) => (
                <TableRow
                  key={row.name.common}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name.common}
                  </TableCell>
                  <TableCell align="right">
                    {row.capital ? row.capital[0] : 'N/A'}
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox
                      checked={favourites.some(fav => fav.name.common === row.name.common)}
                      onChange={() => handleFavouriteChange(row)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Container>
  );
}

export default App;