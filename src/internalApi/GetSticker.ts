import axios from "axios";

import { Sticker } from "@/interfaces/lpexpress";

const GetSticker = (id: string[]) =>
  axios
    .get<Sticker[]>(
      `${window.location.protocol}//${window.location.host}/api/lpexpress/label?id=${id}`
    )
    .then(({ data }) => data);

export default GetSticker;
