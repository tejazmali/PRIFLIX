const contentData = [
    {
        title: "Mr. Robot S1",
        image:
            "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fimage.tmdb.org%2Ft%2Fp%2Foriginal%2F1aiNh5Gak36EdpdwhvWHIXzAj50.jpg",

        folderid: "1-jS6jChfxw-3akR_w7gOmzmLEJ0YLThC",
        type: "Series",

    },
    {
        title: "Mr. Robot S2",
        image:
            "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fimage.tmdb.org%2Ft%2Fp%2Foriginal%2FmjqAWBXM6zoxmoeC3q9J6I1wl7R.jpg",

        folderid: "1yHvChPOqw7fJRQRgnZ308nu2h_7JuXUO",
        type: "Series",

    },
    {
        title: "Mr. Robot S3",
        image:
            "https://image.tmdb.org/t/p/original/whtaWBtS3zauurpEdEMI61489Km.jpg",

        folderid: "1xDm_o5fTkK0XozJxg0fPFrpM4SK9zrgL",
        type: "Series",

    },
    {
        title: "Mr. Robot S4",
        image:
            "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fimage.tmdb.org%2Ft%2Fp%2Foriginal%2F4PxMbpF3pv5B8eYw48hZ1hy16gr.jpg",

        folderid: "1-YymiD6PWLAkcqYYpqdZY5TQIrSOM8im",
        type: "Series",

    },
    {
        title: "Attack on Titan S01",
        image:
            "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fimage.tmdb.org%2Ft%2Fp%2Foriginal%2FAgaD7s1vgIf4Soi3flAKN6Bte6u.jpg",

        folderid: "1-5chzScNIAIbel5gb7VLByT3dz8sYBqZ",
        type: "Anime",

    },
    {
        title: "Attack on Titan S02",
        image:
            "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fimage.tmdb.org%2Ft%2Fp%2Foriginal%2F19REaSRoNcO0KgMmrGUWtfpRKZY.jpg",

        folderid: "1-0P7YawMOKcuJ49A43NdRyFt16L_Hzrv",
        type: "Anime",
    },
    {
        title: "Attack on Titan S03",
        image:
            "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fimage.tmdb.org%2Ft%2Fp%2Foriginal%2Fynow2o9v0G341PLv1chCRDufCgc.jpg",

        folderid: "1mpncw0YC5VqZfMrONJgN0q4U-0o4JZSB",
        type: "Anime",
    },
    {
        title: "Attack on Titan S04",
        image:
            "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fimage.tmdb.org%2Ft%2Fp%2Foriginal%2FsfbSjGlLHsvFQrMUSNR9RrwZgV1.jpg",

        folderid: "1jDKExNViHkEehhN-nqZpzCOUXt2UG6tz",
        type: "Anime",
    },

    {
        title: "Death Note",
        image:
            "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fimage.tmdb.org%2Ft%2Fp%2Foriginal%2FtCZFfYTIwrR7n94J6G14Y4hAFU6.jpg",

        folderid: "1XlCp3canUS1QfNFq0X9YFZK_ZwCu4TLo",
        type: "Anime",
    },
    {
        title: "Shin-chan: Fierceness That Invites Storm!",
        image:
            "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fimage.tmdb.org%2Ft%2Fp%2Foriginal%2FnfpPzlKiqkIGpI8HXpsrU6vnNdp.jpg",

        folderid: "17MR1gtVAAAENqvD9SNlkFwDj-0ylBjqL",
        type: "Cartoon movies",
    },
    
    {
        title: "Ice Age (2002)",
        image:
            "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fmetadata-static.plex.tv%2Fe%2Fgracenote%2Fe24be4e62720ebe500a7e7a3cf1a65cf.jpg",

        folderid: "1PuT1fk7CtI3kyvwKxiPasRsPSrdIYj_0",
        type: "Cartoon movies",
    },
    {
        title: "Ice Age: The Meltdown (2006)",
        image:
            "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fmetadata-static.plex.tv%2F1%2Fgracenote%2F1fe9f7ac98263ff48063ed05767ac60e.jpg",

        folderid: "1Z_2tfu4-UZUXQd33wRk-5bi_uPjQyAjk",
        type: "Cartoon movies",
    },
    {
        title: "Ice Age: Dawn of the Dinosaurs (2009)",
        image:
            "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fmetadata-static.plex.tv%2F5%2Fgracenote%2F54a4822fda75894d4ef2dd652e7ee0c9.jpg",

        folderid: "1XjstRqK2ULtFatabNzzJDsdwPOw9JNck",
        type: "Cartoon movies",
    },
    {
        title: "Ice Age: Continental Drift (2012)",
        image:
            "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fmetadata-static.plex.tv%2F3%2Fgracenote%2F3c7ab35b5224a532a03eed935a563a41.jpg",

        folderid: "1L-NrW0L2y73pmNJmbd6L2YjYA-3Zywib",
        type: "Cartoon movies",
    },

    {
        title: "Ice Age Collision Course (2016)",
        image:
            "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fmetadata-static.plex.tv%2Fa%2Fgracenote%2Faa6c63de12c07543e254a9f1f3aede99.jpg",

        folderid: "1jJbr5gzNs_7TMqg9Q5CGdUXysVH2oTEJ",
        type: "Cartoon movies",
    },

    {
        title: "The Ice Age Adventures of Buck Wild (2022)",
        image:
            "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fmetadata-static.plex.tv%2Fa%2Fgracenote%2Fa0487bd730ee5b1868375ff72ed70a2c.jpg",

        folderid: "16sqFChtQwsGimkKA5F3w1XKoMbNEDe08",
        type: "Cartoon movies",
    },
    {
        title: "Ice Age Scrat Tales S01",
        image:
            "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fimage.tmdb.org%2Ft%2Fp%2Foriginal%2FmTfYwY7DELH08SeO8LyUMe9Tvfr.jpg",

        folderid: "1lUp9gDT-_GuS8pmSaFdf7hlpsZPe8dt5",
        type: "Cartoon movies",
    },

    {
        title: "Ralph Breaks the Internet 2018",
        image:
            "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fmetadata-static.plex.tv%2Fc%2Fgracenote%2Fc4e00199eaa2d5d48a3709e431812fd9.jpg",

        folderid: "1Kx5kc_0hrpOleaia1wcVQsRf3JTfM7BO",
        type: "Cartoon movies",
    },

    {
        title: "Mufasa The Lion King",
        image:
            "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fmetadata-static.plex.tv%2Fb%2Fgracenote%2Fbe69e9091157888531f62d5b1b92587a.jpg",

        folderid: "1GIcbxrhkoNKE0lmLOGaMGRRmaCfLhQVs",
        type: "Cartoon movies",
    },



    {
        title: "Doraemon in Nobita's Great Adventure to the South Seas",
        image:
            "https://images.plex.tv/photo?size=medium-240&scale=2&url=https%3A%2F%2Fimage.tmdb.org%2Ft%2Fp%2Foriginal%2FhLfnLv6DDPz6DL5vFjb1u3nx5lq.jpg",

        folderid: "1XpZOkSKlpm3jLd2UTaa57wKlA1Uqzo5K",
        type: "Cartoon movies",
    },

    {
        title: "Doraemon Nobita's Three Visionary Swordsmen",
        image:
            "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fimage.tmdb.org%2Ft%2Fp%2Foriginal%2Foll0P8SNBrz5vafdq8MDkCyqUEJ.jpg",

        folderid: "1K2snYC39KhXsyfJXEUFRl6vyXiHDVHT4",
        type: "Cartoon movies",
    },

    {
        title: "Doraemon Horror EPs",
        image:
            "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fimage.tmdb.org%2Ft%2Fp%2Foriginal%2F9ZN1P32SHviL3SV51qLivxycvcx.jpg",

        folderid: "14xjH6P1qv8LLl2yTJ2_qvwLzDTeQio8_",
        type: "Cartoon series",
    },
    {
        title: "CTRL",
        image:
            "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fmetadata-static.plex.tv%2Ff%2Fgracenote%2Ffadd5e899723cc47a343fbefb255fbff.jpg",

        folderid: "1Tl9efmBmuVQO_5Vq0pQUFqESycZW5ZHi",
        type: "Movie",
    },
    {
        title: "Searching",
        image:
            "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fmetadata-static.plex.tv%2F5%2Fgracenote%2F590da9fdcf01d06770beb8b9b1d94072.jpg",

        folderid: "1ZoR3CmNfryitPpVDkipCOVXqkGCSMFfn",
        type: "Movie",
    },
    
    {
        title: "Mardaani 2014",
        image:
            "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fmetadata-static.plex.tv%2F5%2Fgracenote%2F54fe6acd5b36dccc91b8f2fa7e32b5fa.jpg",

        folderid: "173tU5ohMT2Eij5QkIpn0XMj3FeHtYjxV",
        type: "Movie",
    },
    {
        title: "3 Idiots",
        image:
            "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fmetadata-static.plex.tv%2F9%2Fgracenote%2F9b1b00f5202b6eac3d365aac0a505bd0.jpg",

        folderid: "1Yt5XwbPfeA73oazfZNpSZLHTREHlwizk",
        type: "Movie",
    },
    {
        title: "Truth or Dare",
        image:
            "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fmetadata-static.plex.tv%2F1%2Fgracenote%2F18dbf68449ab7cb675cf23da4bcaad5e.jpg",

        folderid: "1QnCBGU5lIYV7CyUQrpq9U6Rf2yuXKdGk",
        type: "Movie",
    },
    {
        title: "Life of PI",
        image:
            "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fmetadata-static.plex.tv%2Fa%2Fgracenote%2Fa2a7ce8a1a1c0030a01c721557e67554.jpg",

        folderid: "1tRZcDBvW-M5Oip6cFTtXr7hMK3h4R-pX",
        type: "Movie",
    },


    {
        title: "The Devil Wears Prada",
        image:
            "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fmetadata-static.plex.tv%2Fa%2Fgracenote%2Fa0518bb3b03fd1194ed5c832e17cbe0c.jpg",

        folderid: "1JB3aP5C8FWvc18ahowXKaYAwxX4seYUE",
        type: "Movie",
    },
    {
        title: "Squid Game S2",
        image:
            "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fimage.tmdb.org%2Ft%2Fp%2Foriginal%2FsXZhtWLo3fecavpDuOyJiayjt32.jpg",

        folderid: "1sb-6eFryvMf9mh7tNko_ZzIPuc4q0hUI",
        type: "Series",
    },
    {
        title: "Alice in Borderland S1",
        image:
            "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fimage.tmdb.org%2Ft%2Fp%2Foriginal%2FsGwYqVqheXuevFOBC0BFhFvDU9T.jpg",

        folderid: "1Uozd9h4nuGcBY62QlYSb8LBiiExrDyUX",
        type: "Series",
    },
    {
        title: "Alice in Borderland S2",
        image:
            "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fimage.tmdb.org%2Ft%2Fp%2Foriginal%2Fs3ZAS0AGLQ668sFveVFinAd2zVy.jpg",

        folderid: "1o4qBz6A2-Ffg7bVW6oqxazjFa_Auw6Jf",
        type: "Series",
    },
    {
        title: "Scam 1992 – The Harshad Mehta Story S01",
        image:
            "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fimage.tmdb.org%2Ft%2Fp%2Foriginal%2FfiimZ9Xt5cPTPHNrbS4QautBXpU.jpg",

        folderid: "1TEXHFDJlUAzQm5wSik4gCTCFVeAJIInk",
        type: "Series",
    },
    {
        title: "The Fast and the Furious: Tokyo Drift",
        image:
            "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fmetadata-static.plex.tv%2F3%2Fgracenote%2F3fcca785b083f2d25ba8becc95f840da.jpg",

        folderid: "1Ui9XyTBMY0wRz_YR5qaOj9rY9QHx6AYd",
        type: "Movie",
    },

    {
        title: "Enola Holmes",
        image:
            "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fmetadata-static.plex.tv%2Fe%2Fgracenote%2Fe089f10def76e48787bc8acc269745ca.jpg",

        folderid: "18cF3bXkqkYh2BKaetMq4fwPuUDBq45q3",
        type: "Movie",
    },


    {
        title: "Enola Holmes 2",
        image:
            "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fmetadata-static.plex.tv%2Fd%2Fgracenote%2Fd551c377007710fc338b07569f745fca.jpg",

        folderid: "1BrDOFjpYtnfSOSxKxBfj-lZ8x6XehL3w",
        type: "Movie",
    },
    {
        title: "The Truman Show",
        image:
            "https://images.plex.tv/photo?size=medium-240&scale=2&url=https%3A%2F%2Fmetadata-static.plex.tv%2F5%2Fgracenote%2F58a340b72f0aabab670a993d7476aaca.jpg",

        folderid: "1ZpeMA3SntuZS3ZQk7Bd7GyQL9uEHfo8j",
        type: "Movie",
    },
    {
        title: "Lucky Baskhar",
        image:
            "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fmetadata-static.plex.tv%2Fc%2Fgracenote%2Fc3a704b55ef6b15d1f929243abccb03d.jpg",

        folderid: "1SulqE1WMqj-4y1JBPHzxKSEJcmJ_9PN5",
        type: "Movie",
    },
];

