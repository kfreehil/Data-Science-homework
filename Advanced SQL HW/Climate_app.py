import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, extract, sql

from flask import Flask, jsonify

import datetime as dt

#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///Resources/hawaii.sqlite")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the tables
Measurement = Base.classes.measurement
Station = Base.classes.station

# Create our session (link) from Python to the DB
session = Session(engine)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/precipitation<br/>"
        f"/api/v1.0/stations<br/>"
        f"/api/v1.0/tobs<br/>"
        f"/api/v1.0<start><br/>"
        f"/api/v1.0<start>/<end>"
    )


@app.route("/api/v1.0/precipitation")
def daily_precipitation():
    """Return daily precipitation numbers spanning Aug 2016 to Aug 2017"""
    """Note I used func.avg(Measurement.date) and a group_by to get on prcp value for each date"""
    """This enabled me to return ONE prcp value and use the date as a key in the key/value json returned"""
    # Calculate the date 1 year ago from the last data point in the database
    results1 = session.query(extract('year',Measurement.date),extract('month',Measurement.date), extract('day',Measurement.date)).order_by(Measurement.date.desc()).limit(1)
    last_date = results1[0]
    one_yr_prior = dt.datetime(last_date[0]-1,last_date[1], last_date[2])

    # Perform a query to retrieve the average daily precipitation scores across the various stations
    results2 = session.query(Measurement.date, func.avg(Measurement.prcp)).\
        filter(Measurement.date >= one_yr_prior).\
        filter(Measurement.prcp != 'nan').\
        group_by(Measurement.date).\
        order_by(Measurement.date.asc()).all()

   # Create a dictionary from the data retrieved
    precipitation_dict = {}
    for date, prcp in results2:
        precipitation_dict[date] = prcp

    return jsonify(precipitation_dict)


@app.route("/api/v1.0/stations")
def get_stations():
    """Return a list of station names"""
    # Perform query to retrieve all stations
    results = session.query(Station.name).all()

    # Convert list of tuples into normal list
    all_stations = list(np.ravel(results))

    return jsonify(all_stations)
    

@app.route("/api/v1.0/tobs")
def daily_tobs():
    """Return daily temperature observations spanning Aug 2016 to Aug 2017"""
    # Calculate the date 1 year ago from the last data point in the database
    results1 = session.query(extract('year',Measurement.date),extract('month',Measurement.date), extract('day',Measurement.date)).order_by(Measurement.date.desc()).limit(1)
    last_date = results1[0]
    one_yr_prior = dt.datetime(last_date[0]-1,last_date[1], last_date[2])

    # Perform a query to retrieve the tobs, removing nan values and sorting by date
    results2 = session.query(Measurement.date, Measurement.tobs).\
        filter(Measurement.date >= one_yr_prior).\
        filter(Measurement.tobs != 'nan').\
        order_by(Measurement.date.asc()).all()

    # convert result into list
    daily_tobs = []
    for date, tobs in results2:
        tob = [date, tobs]
        daily_tobs.append(tob)

    return jsonify(daily_tobs)


@app.route("/api/v1.0<start>")
def calc_temps_start(start_date):
    """Return the minimum, average, and maximum temperatures for a range of dates given a <start_date>"""
    # Perform a query to retrieve the tobs, removing nan values and sorting by date
    result = session.query(func.min(Measurement.tobs), func.avg(Measurement.tobs), func.max(Measurement.tobs)).\
        filter(Measurement.date >= start_date).all()

    # convert result into list
    temps = list(np.ravel(result))

    return jsonify(temps)


@app.route("/api/v1.0<start>/<end>")
def calc_temps_start_end(start_date, end_date):
    """Return the minimum, average, and maximum temperatures for a range of dates given a <start_date> and <end_date>"""
    # Perform a query to retrieve the tobs, removing nan values and sorting by date
    result = session.query(func.min(Measurement.tobs), func.avg(Measurement.tobs), func.max(Measurement.tobs)).\
        filter(Measurement.date >= start_date).filter(Measurement.date <= end_date).all()

    # convert result into list
    temps = list(np.ravel(result))

    return jsonify(temps)


if __name__ == '__main__':
    app.run(debug=True)
