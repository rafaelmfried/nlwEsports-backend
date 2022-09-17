import express from 'express';
import cors from 'cors';

import { PrismaClient } from '@prisma/client';

import * as dotenv from 'dotenv';
import { convertHourStringToMinutes } from './utils/convert-hour-string-to-minutes';
import { convertMinutesToHourSring } from './utils/convert-minutes-to-hour-string';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const prisma = new PrismaClient({
  log: ['query']
});

const PORT = process.env.PORT || 3000;

app.get('/games', async (_request, response) => {
    const games = await prisma.game.findMany({
      include: {
        _count: {
          select: {
            Ads: true,
          }
        }
      }
    });
    return response.status(200).json(games);
  });

app.get('/games/:id/ads', async (request, response) => {
  const gameId = request.params.id;

  const ads = await prisma.ad.findMany({
    select: {
      id: true,
      name: true,
      weekDays: true,
      useVoiceChannel: true,
      yearsPlaying: true,
      hourStart: true,
      hourEnd: true,
    },
    where: {
      gameId,
    },
    orderBy: {
      createdAt: 'desc',
    }
  })
    return response.status(200).json(ads.map( ad => {
      return {
        ...ad,
        weekDays: ad.weekDays.split(','),
        hourStart: convertMinutesToHourSring(ad.hourStart),
        hourEnd: convertMinutesToHourSring(ad.hourEnd),
      }
    }));
  });

app.post('/games/:id/ads', async (request, response) => {
  const gameId = request.params.id;
  const {
    name,
    yearsPlaying,
    discord,
    weekDays,
    hourStart,
    hourEnd,
    useVoiceChannel,
  } = request.body;

  const ad = await prisma.ad.create({
    data: {
      gameId,
      name,
      yearsPlaying,
      discord,
      weekDays: weekDays.join(','),
      hourStart: convertHourStringToMinutes(hourStart),
      hourEnd: convertHourStringToMinutes(hourEnd),
      useVoiceChannel
    }
  })
    return response.status(201).json(ad);
});
  
app.get('/ads/:id/discord', async (request, response) => {
  const adId = request.params.id;

  const ad = await prisma.ad.findUniqueOrThrow({
    select: {
      discord: true,
    },
    where: {
      id: adId,
    }
  })
  return response.status(200).json({
    discord: ad.discord,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});