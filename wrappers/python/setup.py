#!/usr/bin/env python

from setuptools import setup, find_packages

setup(
    name='fancyhands-python',
    version='0.2dev',
    packages = find_packages(),
    license='MIT',
    install_requires = ['httplib2', 'oauth2',],
    long_description=open('README.md').read(),
    include_package_data = True,
)
