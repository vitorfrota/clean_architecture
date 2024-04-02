import axios from "axios";

axios.defaults.validateStatus = status => status >= 200 && status <= 500;

describe("Signup POST tests", function () {
  const ENDPOINT_URL = "http://localhost:3000/signup";
  test('It should create a passenger user', async function () {
    const { data } = await axios.post(ENDPOINT_URL, {
      name: "Vitor Hugo",
      email: "v@example.com",
      cpf: "15987930200",
      isDriver: false,
      isPassenger: true,
      password: "123456"
    });
  
    expect(data).toHaveProperty("accountId");
  });
  test('It should create a driver user', async function () {
    const { data } = await axios.post(ENDPOINT_URL, {
      name: "Vitor Hugo",
      email: "vdriver@example.com",
      cpf: "15987930200",
      isDriver: true,
      isPassenger: false,
      carPlate: "ABC1234",
      password: "123456"
    });
  
    expect(data).toHaveProperty("accountId");
  });
  test('It should not create a user with existing email', async function () {
    const { data } = await axios.post(ENDPOINT_URL, {
      name: "Vitor Hugo",
      email: "v@example.com",
      cpf: "15987930200",
      isPassenger: true,
      password: "123456"
    });

    expect(data).toBe(-4);
  });
  test('It should not create a user with invalid name', async function () {
    const { data } = await axios.post(ENDPOINT_URL, {
      name: "123123123",
      email: "v1@example.com",
      cpf: "15987930200",
      isPassenger: true,
      password: "123456"
    });

    expect(data).toBe(-3);
  });
  test('It should not create a user with invalid email', async function () {
    const { data } = await axios.post(ENDPOINT_URL, {
      name: "Vitor Hugo",
      email: "v1example.comm",
      cpf: "15987930200",
      isPassenger: true,
      password: "123456"
    });

    expect(data).toBe(-2);
  });
  test('It should not create a user with invalid cpf', async function () {
    const { data } = await axios.post(ENDPOINT_URL, {
      name: "Vitor Hugo",
      email: "v2@example.com",
      cpf: "11111111",
      isPassenger: true,
      password: "123456"
    });

    expect(data).toBe(-1);
  });
  test('It should not create a user driver with invalid car plate', async function () {
    const { data } = await axios.post(ENDPOINT_URL, {
      name: "Vitor Hugo",
      email: "v3@example.com",
      cpf: "15987930200",
      isPassenger: false,
      isDriver: true,
      carPlate: "000000",
      password: "123456"
    });

    expect(data).toBe(-5);
  });
  test('It should not create a user with invalid password', async function () {
    const { data } = await axios.post(ENDPOINT_URL, {
      name: "Vitor Hugo",
      email: "v4@example.com",
      cpf: "15987930200",
      isPassenger: false,
      isDriver: true,
      carPlate: "000000",
      password: "12345"
    });

    expect(data).toBe(-6);
  });
});