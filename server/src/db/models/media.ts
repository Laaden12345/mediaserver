import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  DataTypes,
  Association,
  ForeignKey,
  UUIDV4,
} from "sequelize"

import sequelize from ".."

export enum VideoType {
  Series,
  Movie,
}

export class Series extends Model<
  InferAttributes<Series, { omit: "seasons" }>,
  InferCreationAttributes<Series, { omit: "seasons" }>
> {
  declare id: CreationOptional<string>
  declare name: string
  declare description: string | null
  declare tmdbID: number | null
  declare releaseDate: Date | null
  declare poster: string | null
  declare updatedAt: CreationOptional<Date>
  declare createdAt: CreationOptional<Date>
  declare seasons?: NonAttribute<Episode[]>

  declare static associations: { seasons: Association<Series, Season> }
}

export class Season extends Model<
  InferAttributes<Season, { omit: "episodes" }>,
  InferCreationAttributes<Season, { omit: "episodes" }>
> {
  declare id: CreationOptional<string>
  declare tmdbID: number | null
  declare number: number
  declare description: string | null
  declare poster: string | null
  declare updatedAt: CreationOptional<Date>
  declare createdAt: CreationOptional<Date>
  declare seriesId: ForeignKey<Series["id"]>
  declare episodes?: NonAttribute<Episode[]>

  declare static associations: {
    series: Association<Season, Series>
    episodes: Association<Season, Episode>
  }
}

export class Episode extends Model {
  declare id: CreationOptional<string>
  declare name: string | null
  declare description: string | null
  declare tmdbID: number | null
  declare releaseDate: Date | null
  declare updatedAt: CreationOptional<Date>
  declare createdAt: CreationOptional<Date>
  declare path: string
  declare thumbnail: string | null
  declare seriesName: string
  declare series: NonAttribute<Series>
  declare season: NonAttribute<Season>
  declare episodeNumber: number
  declare seasonNumber: number

  declare static associations: {
    series: Association<Episode, Series>
    season: Association<Episode, Season>
  }
}

export class Movie extends Model {
  declare id: CreationOptional<string>
  declare name: string
  declare description: string | null
  declare tmdbID: number | null
  declare releaseDate: Date | null
  declare updatedAt: CreationOptional<Date>
  declare createdAt: CreationOptional<Date>
  declare seasons?: NonAttribute<Episode[]>
  declare path: string
}

Series.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tmdbID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    poster: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    releaseDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedAt: DataTypes.DATE,
    createdAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "series",
  }
)

Season.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    tmdbID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    poster: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    updatedAt: DataTypes.DATE,
    createdAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "seasons",
  }
)

Episode.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    seriesName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tmdbID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    releaseDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    episodeNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    seasonNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    updatedAt: DataTypes.DATE,
    createdAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "episodes",
  }
)

Movie.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tmdbID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    releaseDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "movies",
  }
)

Series.hasMany(Season, {
  foreignKey: "seriesId",
  as: "seasons",
})

Season.belongsTo(Series, {
  foreignKey: "seriesId",
  as: "series",
})

Season.hasMany(Episode, {
  foreignKey: "seasonId",
  as: "episodes",
})

Episode.belongsTo(Season, {
  foreignKey: "seasonId",
  as: "season",
})

Episode.belongsTo(Series, {
  foreignKey: "seriesId",
  as: "series",
})

sequelize.sync()
