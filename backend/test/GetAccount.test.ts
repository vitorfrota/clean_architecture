import axios from "axios";

axios.defaults.validateStatus = status => status >= 200 && status <= 500;

describe("GetAccount GET tests", function () {
  const ENDPOINT_URL = "http://localhost:3000";
  test('It should get a existing user', async function () {
    const { data } = await axios.post(`${ENDPOINT_URL}/signup`, {
      name: "Vitor Teste",
      email: "vitory@test.com",
      cpf: "15987930200",
      isDriver: false,
      isPassenger: true,
    });

    const { data: output } = await axios.get(`${ENDPOINT_URL}/account/${data.accountId}`);
    expect(output).toHaveProperty("name");
    expect(output).toHaveProperty("email");
  });
  test('It should not get a user with inexistent id', async function () {
    const { data: output } = await axios.get(`${ENDPOINT_URL}/account/fd36337c-5e99-4af2-8042-a7364a8f6066`);
    expect(output).toBe(-1);
  });
});