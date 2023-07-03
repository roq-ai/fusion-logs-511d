import * as yup from 'yup';

export const logValidationSchema = yup.object().shape({
  player_id: yup.string().required(),
  date: yup.date().required(),
  type: yup.string().required(),
  permission: yup.string().required(),
  game_server_id: yup.string().nullable().required(),
});
